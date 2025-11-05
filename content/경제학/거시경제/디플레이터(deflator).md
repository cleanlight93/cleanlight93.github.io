---
title: 디플레이터(deflator)
date: 2025-11-05
tags:
  - 국민계정
  - 거시경제학
  - 통계학
  - 미시경제학
description: 디플레이터(deflator)
---
## 정의

deflate는 아래와 같은 뜻을 가지고 있다.

> *to cause (prices, costs, etc.) to decrease
> to cause (something, such as money or real estate) to lose value.*

디플레이터(deflator)는 어떤 시점의 명목가치 시계열 데이터를 특정 기준시점의 가격수준으로 환산하는 데에 사용하는 척도함수이다.

가격벡터 $\mathbf{p}_t\in \mathbb{R}_{+}^{n}$와 수량벡터 $\mathbf{q}_t\in \mathbb{R}_{+}^{n}$가 주여졌을 때, 명목가치는 $V_t = \mathbf{p}_t\,\cdot\,\mathbf{q}_t$이다. 여기서 $\cdot$은 내적(dot product)연산자이다. 이제 기준시점 $t=b$를 정하고, 실질가치를 $R_t = \mathbf{p}_b\,\cdot\,\mathbf{q}_t$라고 정의하면 디플레이터는
$$
D_t = \frac{V_t}{R_t}=\frac{\mathbf{p}_t\,\cdot\,\mathbf{q}_t}{\mathbf{p}_b\,\cdot\,\mathbf{q}_t}
$$
로 정의된다. 또한 이 때 디플레이터는 파셰 가격지수와 동일하게 된다. 그리고 GDP 디플레이터 역시 위와 같은 방법으로 계산한다.

---
## 참고
[Wiki-Price index](https://en.wikipedia.org/wiki/Price_index)