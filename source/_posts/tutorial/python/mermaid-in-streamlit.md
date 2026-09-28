---
title: Streamlit 中使用 Mermaid 流程图
date: 2023/12/04
cover: https://miro.medium.com/v2/resize:fit:720/format:webp/1*wsFIs-03Ep6f1XOoSkS9Kw.png
categories:
  - Tutorials
tags:
  - Python
  - Streamlit
---

streamlit 的 Markdown 不支持 mermaid，使用组件调用外部 js

<!-- more -->

[St.markdown does not render mermaid graphs](https://discuss.streamlit.io/t/st-markdown-does-not-render-mermaid-graphs/25576)

```python
def mermaid(code: str) -> None:
    components.html(
        f"""
        <pre class="mermaid">
            {code}
        </pre>

        <script type="module">
            import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs';
            mermaid.initialize({{ startOnLoad: true }});
        </script>
        """
    )

mermaid("""
    graph LR
        A --> B --> C
""")
```

带动态高度调整的完整版本：

```python
from time import sleep
import streamlit as st
from streamlit.components.v1 import html
from streamlit_js_eval import streamlit_js_eval

if "svg_height" not in st.session_state:
    st.session_state["svg_height"] = 200

if "previous_mermaid" not in st.session_state:
    st.session_state["previous_mermaid"] = ""

def mermaid(code: str) -> None:
    html(
        f"""
        <pre class="mermaid">
            {code}
        </pre>
        <script type="module">
            import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs';
            mermaid.initialize({{ startOnLoad: true }});
        </script>
        """,
        height=st.session_state["svg_height"] + 50,
    )

selection = st.selectbox("Choose example", ["Simple", "Class Diagram", "Flowchart"])

if selection == "Simple":
    code = """
    graph LR
        A --> B --> C
    """
elif selection == "Class Diagram":
    code = """
    classDiagram
        Animal <|-- Duck
        Animal <|-- Fish
        Animal <|-- Zebra
        Animal : +int age
        class Duck{ +String beakColor +swim() +quack() }
        class Fish{ -int sizeInFeet -canEat() }
        class Zebra{ +bool is_wild +run() }
    """
else:
    code = """
    graph TD
        A[Christmas] -->|Get money| B(Go shopping)
        B --> C{Let me think}
        C -->|One| D[Laptop]
        C -->|Two| E[iPhone]
        C -->|Three| F[fa:fa-car Car]
    """

mermaid(code)

if code != st.session_state["previous_mermaid"]:
    st.session_state["previous_mermaid"] = code
    sleep(1)
    streamlit_js_eval(
        js_expressions='parent.document.getElementsByTagName("iframe")[0].contentDocument.getElementsByClassName("mermaid")[0].getElementsByTagName("svg")[0].getBBox().height',
        key="svg_height",
    )
```
