#!/usr/bin/env python3
"""从 mapgroup.svg 生成带 land / water / light-columns / light-dots 分组的 structured 文件"""

import re
from collections import defaultdict
from pathlib import Path
from typing import Dict, List, Optional, Tuple

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "public/assets/mapgroup.svg"
OUT = ROOT / "public/assets/mapgroup.structured.svg"

LAYER_KEYS = {
    "land": ("land", "map"),
    "water": ("water",),
    "light-columns": ("light-columns", "light_columns"),
    "light-dots": ("light-dots", "light_dots"),
}


def extract_g_block(body: str, gid: str) -> Optional[str]:
    pattern = rf'<g\s+id="{re.escape(gid)}"[^>]*>'
    m = re.search(pattern, body)
    if not m:
        return None
    start = m.start()
    depth = 0
    i = m.start()
    while i < len(body):
        if body[i : i + 2] == "<g":
            depth += 1
        elif body[i : i + 3] == "</g":
            depth -= 1
            if depth == 0:
                return body[start : i + 4]
        i += 1
    return None


def id_matches_key(gid: str, key: str) -> bool:
    gl, kl = gid.lower(), key.lower()
    if gl == kl:
        return True
    if gl.endswith(f"-{kl}") or gl.endswith(f"_{kl}"):
        return True
    if gl.startswith(f"{kl}-") or gl.startswith(f"{kl}_"):
        return True
    return False


def find_exported_group(body: str, keys: Tuple[str, ...]) -> Optional[str]:
    ids = re.findall(r'\bid="([^"]+)"', body)
    for key in keys:
        for gid in ids:
            if id_matches_key(gid, key):
                block = extract_g_block(body, gid)
                if block:
                    return block
    return None


def is_water_path(path: str) -> bool:
    """水域：paint0–paint5 灰蓝/蓝色渐变"""
    return any(f"paint{i}_linear" in path for i in range(6))


def is_column_path(path: str) -> bool:
    return "url(#paint" in path and "linear" in path and not is_water_path(path)


def classify_paths(paths: List[str]) -> Dict[str, List[str]]:
    land_paths: List[str] = []
    water_paths: List[str] = []
    col_paths: List[str] = []

    for p in paths:
        if is_water_path(p):
            water_paths.append(p)
        elif is_column_path(p):
            col_paths.append(p)
        else:
            land_paths.append(p)

    return {"land": land_paths, "water": water_paths, "columns": col_paths}


def classify_circles(circles: List[str]) -> List[str]:
    groups = defaultdict(list)
    for c in circles:
        cx = float(re.search(r'cx="([^"]+)"', c).group(1))
        cy = float(re.search(r'cy="([^"]+)"', c).group(1))
        groups[(round(cx, 1), round(cy, 1))].append(c)

    nodes = []
    for (cx, cy), cs in sorted(groups.items()):
        inner = "\n".join(cs)
        ripple = (
            f'<circle class="map-dot-ripple" cx="{cx}" cy="{cy}" r="3" '
            f'fill="none" stroke="white" stroke-width="1" opacity="0"/>'
        )
        nodes.append(
            f'<g class="map-dot-node" transform="translate({cx},{cy})" '
            f'data-cx="{cx}" data-cy="{cy}">\n'
            f'<g transform="translate({-cx},{-cy})">\n{inner}\n{ripple}\n'
            f"</g></g>"
        )
    return nodes


def main() -> None:
    svg = SRC.read_text()
    header = re.match(r"(<svg[^>]*>)", svg).group(1)
    defs = svg[svg.find("<defs>") :]
    body = svg[svg.find(">") + 1 : svg.find("<defs>")]

    layers: Dict[str, str] = {}

    for layer_id, keys in LAYER_KEYS.items():
        block = find_exported_group(body, keys)
        if block:
            layers[layer_id] = block if block.startswith("<g") else f'<g id="{layer_id}">\n{block}\n</g>'

    paths = re.findall(r"<path.*?/>", body, re.DOTALL)
    filter_gs = re.findall(
        r'<g filter="url\(#filter\d+_f_423_274017\)"[^>]*>.*?</g>', body, re.DOTALL
    )

    classified = classify_paths(paths)

    if "land" not in layers:
        land_content = "\n".join(classified["land"])
        if land_content:
            layers["land"] = f'<g id="land">\n{land_content}\n</g>'

    if "water" not in layers:
        water_content = "\n".join(classified["water"])
        if water_content:
            layers["water"] = f'<g id="water">\n{water_content}\n</g>'

    if "light-columns" not in layers:
        col_content = "\n".join(classified["columns"] + filter_gs)
        if col_content:
            layers["light-columns"] = f'<g id="light-columns">\n{col_content}\n</g>'

    if "light-dots" not in layers:
        body_tmp = body
        for g in filter_gs:
            body_tmp = body_tmp.replace(g, "", 1)
        body_tmp = re.sub(r"<path.*?/>", "", body_tmp, flags=re.DOTALL)
        circles = re.findall(r"<circle[^>]*/>", body_tmp)
        dot_nodes = classify_circles(circles)
        if dot_nodes:
            layers["light-dots"] = (
                f'<g id="light-dots">\n' + "\n".join(dot_nodes) + "\n</g>"
            )

    order = ["water", "land", "light-columns", "light-dots"]
    out = header + "\n"
    for key in order:
        if key in layers:
            out += layers[key] + "\n"
    out += defs

    OUT.write_text(out)
    print(f"written {OUT} ({OUT.stat().st_size} bytes)")
    for key in order:
        print(f"  {key}: {'yes' if key in layers and len(layers[key]) > 20 else 'empty'}")


if __name__ == "__main__":
    main()
