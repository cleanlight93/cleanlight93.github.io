---
title: Adrian-Crump-Moench(ACM) Term Structure Model(작성 중)
date: 2026-01-17
tags:
  - FICC
  - 금융
  - 채권
  - 수익률곡선
  - 기간프리미엄
  - 금융공학
description: Adrian-Crump-Moench(ACM) Term Structure Model(작성 중)
---
_**Last Updated: 2026.01.17.**_

추정 방법론을 더 자세하게 수정할 필요가 있음.

---

[[Pricing the term structure with linear regressions (ACM 2013).pdf]]

---

먼저, 2012년부터 민평3사 국고10Y YTM을 [[Smith-Wilson Yield Curves|Smith-Wilson]] 방법론을 사용하여 무이표금리로 전환한 것을 사용하여 ACM모형으로 적합시켜 기대금리와 기간프리미엄으로 분해시킨 결과는 아래와 같음.

<center>
	<img src = "Pasted image 20260117133713.png">
</center>

---

## 개요

ACM 모형은 일별 무이표금리로 이루어진 수익률곡선을 구성하고, 이 패널로부터 주성분분석을 통해 상태변수(Factor)를 추출한 뒤, 무차익(no-arbitrage) 구조 및 위험가격을 측정하여 적합수익률과 위험중립수익률을 만든다. 그리고 이 둘을 통해 기간프리미엄을 산출한다.

### 주성분분석(PCA)을 통한 요인추출

ACM모형은 수익률곡선의 주성분을 관측 가능한 프라이싱 요인으로 사용한다. 각 시점 $t$에 대해 만기별 무이표금리 벡터를
$$
\mathbf{Y}_t
=
\begin{bmatrix}
y_t^{(n_1)} \\
\vdots \\
y_t^{(n_M)}
\end{bmatrix}​​​ 
\in \mathbb{R}^M
$$
로 둔다. 이제 이 시계열 표본분산에 대한 고유값분해를 통해 첫 번째부터 다섯 번째까지의 주성분을 추출하여 아래와 같은 주성분 스코어(score)
$$
\mathbf{X}_t = \mathbf{W}'(\mathbf{Y}_t - \bar{\mathbf{Y}}) \in \mathbb{R}^5
$$
를 만든다. 여기서 $\mathbf{W}\in \mathbb{R}^{M\times 5}$는 상위 5개 고유벡터를 열으로 갖는 적재행렬(loadings)이다.

### 기간구조(affine) 설정

이제 위의 주성분, 즉 상태변수가 역사적 측도 $\mathbb{P}$ 하에서 VAR(1)을 따른다고 둔다.
$$
\mathbf{X}_{t+1}=\boldsymbol{\mu} + \boldsymbol{\Phi}\mathbf{X}_t+\boldsymbol{\varepsilon}_{t+1}
\quad
\left.\boldsymbol{\varepsilon}_{t+1}\right|\mathcal{F}_t \sim \mathcal{N}(0,\boldsymbol{\Sigma})
$$
또한 무차익조건(bo-arbitrage)을 위해 확률할인인자(pricing kernel) $M_{t+1}$과 위험가격 $\boldsymbol{\lambda}_t$를 아래와 같이 둔다.
$$
M_{t+1}=\exp\left(-r_t-\frac{1}{2}\boldsymbol{\lambda}_t'\boldsymbol{\lambda}_t-\boldsymbol{\lambda}_t'\boldsymbol{\Sigma}^{-1/2}\boldsymbol{\varepsilon}_{t+1}\right)\,,\quad\boldsymbol{\lambda}_t=\boldsymbol{\Sigma}^{-1/2}(\boldsymbol{\lambda}_0+\boldsymbol{\lambda}_1\mathbf{X}_t)
$$
여기서 $r_t$는 1기간 단기금리이다. 이렇게 둠으로써 무이표채권가격에 로그를 취한 값이 상태변수에 선형이 된다. 즉, 만기 $n$의 무이표금리 가격 $P_t^{(n)}$에 대해 다음이 성립하게 된다.
$$
\ln P_t^{(n)} = \mathbf{A}_n+\mathbf{B}_n'\mathbf{X}_t + u_t^{(n)}
$$
따라서 연속복리 수익률 역시
$$
y_t^{(n)}=-\frac{1}{n} \ln P_{t}^{(n)} = -\frac{1}{n}\left(\mathbf{A}_n+\mathbf{B}_n'\mathbf{X}_t + u_t^{(n)}\right)
$$
즉 상태변수의 선형함수가 된다.

또한 초과수익률은 아래와 같이 정의한다.
$$
rx_{t+1}^{(n-1)}=\ln P_t^{(n-1)} -\ln P_t^{(n)}-r_t 
$$
위의 $\ln P_t^{(n)}$ 정의에 따르면, 이 초과수익률에는 $u$가 포함되어있음을 알 수 있다.

한편 $\mathbf{A}_n$과 $\mathbf{B}_n$는 위험중립측도($\mathbb{Q}$) 하의 상태변수 전이에 의해 재귀적으로 결정된다. 위험가격이 주어지면 위험중립전이는 다음과 같다.
$$
\mathbf{X}_{t+1}=\boldsymbol{\mu}^{\mathbb{Q}} + \boldsymbol{\Phi}^{\mathbb{Q}}\mathbf{X}_t+\boldsymbol{\varepsilon}^{\mathbb{Q}}_{t+1}
\quad
\boldsymbol{\varepsilon}^{\mathbb{Q}}_{t+1} \sim \mathcal{N}(0,\boldsymbol{\Sigma})
$$
단,  $\boldsymbol{\mu}^{\mathbb{Q}} = \boldsymbol{\mu} - \boldsymbol{\lambda}_0$ 이고 $\boldsymbol{\Phi}^{\mathbb{Q}} = \boldsymbol{\Phi} - \boldsymbol{\lambda}_1$이다. 이 때 람다값들은 위험가격이다.

이제 재귀식은 아래와 같다.
$$
\begin{align*}
&\mathbf{A}_0 = 0, \mathbf{B}_0=0
\\
&\mathbf{A}_{n}= \mathbf{A}_{n-1}+\mathbf{B}'_{n-1}\boldsymbol{\mu}^{\mathbb{Q}}+\frac{1}{2}\left(\mathbf{B}'_{n-1}\boldsymbol{\Sigma}\mathbf{B}_{n-1}+\sigma^2\right)-\boldsymbol{\delta}_0
\\
&\mathbf{B}'_{n}= \mathbf{B}'_{n-1}\boldsymbol{\Phi}^{\mathbb{Q}}-\boldsymbol{\delta}_1'
\end{align*}
$$
### OLS 추정

이제 위의 식들에서 모수(parameter)들을 OLS를 이용해 추정한다.
#### 1. VAR(1) 추정
앞서 만든 요인 $\mathbf{X}_t$에 대해
$$
\mathbf{X}_{t+1}=\boldsymbol{\mu} + \boldsymbol{\Phi}\mathbf{X}_t+\boldsymbol{\varepsilon}_{t+1}
\quad
\left.\boldsymbol{\varepsilon}_{t+1}\right|\mathcal{F}_t \sim \mathcal{N}(0,\boldsymbol{\Sigma})
$$
를 OLS로 적합한다.
#### 2. 만기별 초과수익률의 위험노출 추정
이제 만기 $n$의 1기간(1개월) 보유 초과수익률
$$
rx_{t+1}^{(n-1)}=\ln P_t^{(n-1)} -\ln P_t^{(n)}-r_t 
$$
에서 모수값을 추정한다.
#### 3. 시장위험가격 추정
2.로부터 얻은 모수들을 이용하여 위험가격 $\boldsymbol{\lambda}_0$과 $\boldsymbol{\lambda}_1$을 추정한다.

### 기간구조 분해

모든 모수값을 추정했다면 위에서 언급한 재귀식

$$
\begin{align*}
&\mathbf{A}_0 = 0, \mathbf{B}_0=0
\\
&\mathbf{A}_{n}= \mathbf{A}_{n-1}+\mathbf{B}'_{n-1}\boldsymbol{\mu}^{\mathbb{Q}}+\frac{1}{2}\left(\mathbf{B}'_{n-1}\boldsymbol{\Sigma}\mathbf{B}_{n-1}+\sigma^2\right)-\boldsymbol{\delta}_0
\\
&\mathbf{B}'_{n}= \mathbf{B}'_{n-1}\boldsymbol{\Phi}^{\mathbb{Q}}-\boldsymbol{\delta}_1'
\end{align*}
$$

을 통해 모든 $\mathbf{A}_n$ 및 $\mathbf{B}_n$를 얻은 뒤, 이를 통해 적합수익률
$$
\ln P_{t,\text{Fitted}}^{(n)} = \mathbf{A}_n+\mathbf{B}_n'\mathbf{X}_t\Longrightarrow y_{t,\text{Fitted}}^{(n)} = -\frac{1}{n}\left(\mathbf{A}_n+\mathbf{B}_n'\mathbf{X}_t\right)
$$
을 얻을 수 있다. 뿐만 아니라 위의 재귀식에서 위험가격 $\boldsymbol{\lambda}_0$과 $\boldsymbol{\lambda}_1$을 0으로 둔 뒤 구한 $A_n$과 $B_n$을 이용해 risk-neutral 금리 $y_{t,RN}^{(n)}$을 구하여 기간프리미엄
$$
TP_t^{(n)}= y_{t,\text{Fitted}}^{(n)} - y_{t,RN}^{(n)}
$$
을 계산한다.

---
