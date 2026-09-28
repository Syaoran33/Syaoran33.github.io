---
title: 安装NPU版本本地多模态小模型
date: 2026/6/24
cover: https://miro.medium.com/v2/resize:fit:1100/format:webp/1*4fKWDmL0o_rd6Y6f1xtFyg.png
categories:
  - Tutorials
tags:
  - LLM
  - NPU
---

终于让酷睿Ultra5的NPU跑起来一次
<!--more-->

[OpenVINO/gemma-3-4b-it-int4-cw-ov](https://huggingface.co/OpenVINO/gemma-3-4b-it-int4-cw-ov)

Google 第三代 40 亿参数的对话大模型，经过了英特尔官方的精细化 4-bit 压缩，专门用在 Intel 硬件上本地免配置、高效率运行

## 操作步骤

1. 环境配置，安装依赖

```
mkdir gemma-ocr && cd gemma-ocr
uv init
uv venv --python 3.12
uv add openvino openvino-tokenizers openvino-genai huggingface_hub
uv add pillow requests
```

2. 下载模型

```
import huggingface_hub as hf_hub

model_id = "OpenVINO/gemma-3-4b-it-int4-cw-ov"
model_path = "gemma-3-4b-it-int4-cw-ov"

hf_hub.snapshot_download(model_id, local_dir=model_path)

```

3. 运行模型接口

```
import openvino_genai as ov_genai
import requests
from PIL import Image
from io import BytesIO
import numpy as np
import openvino as ov

device = "NPU"
pipe = ov_genai.VLMPipeline(model_path, device)

def load_image(image_file):
    if isinstance(image_file, str) and (image_file.startswith("http") or image_file.startswith("https")):
        response = requests.get(image_file)
        image = Image.open(BytesIO(response.content)).convert("RGB")
    else:
        image = Image.open(image_file).convert("RGB")
    image_data = np.array(image.getdata()).reshape(1, image.size[1], image.size[0], 3).astype(np.uint8)
    return ov.Tensor(image_data)

prompt = "What is unusual in this picture?"

url = "https://github.com/openvinotoolkit/openvino_notebooks/assets/29454499/d5fbbd1a-d484-415c-88cb-9986625b7b11"
image_tensor = load_image(url)

def streamer(subword: str) -> bool:
    print(subword, end="", flush=True)
    return False

pipe.start_chat()
output = pipe.generate(prompt, image=image_tensor, max_new_tokens=100, streamer=streamer)
pipe.finish_chat()

```

