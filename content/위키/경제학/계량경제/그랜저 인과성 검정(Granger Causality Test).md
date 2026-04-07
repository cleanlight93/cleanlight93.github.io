---
title: 그랜저 인과성 검정(Granger Causality Test)
date: 2025-12-18
tags:
  - 시계열
  - 그랜저인과성
  - GrangerCausality
description: 그랜저 인과성 검정(Granger Causality Test)
---
## 정의
---
변수 $X$가 변수 $Y$를 그랜저 인과하지 않는다는 것은 곧 변수 $X$가 변수 $Y$를 예측(forecast)하는 데에 도움이 되지 않음을 의미한다. 좀 더 정확히 말하면 모든 $s>0$ 에 대해서, ($Y_{1,t},Y_{1,t-1},Y_{1,t-2},\cdots$)에 기반한 변수 $Y_{1,t+s}$의 (조건부) 예측치의 평균제곱오차(mean squared error, MSE)가 ($Y_{1,t},Y_{1,t-1},Y_{1,t-2},\cdots$) 및 ($Y_{2,t},Y_{2,t-1},Y_{2,t-2},\cdots$)에 기반한 변수 $Y_{1,t+s}$의 예측치의 평균제곱오차와 동일하다면 $Y_{2}$는 $Y_1$를 그랜저 인과하지 않는다.
$$
\begin{align*}
& MSE\left(\hat{\mathbb{E}}\left[Y_{1,t+s}\left|Y_{1,t},Y_{1,t-1},Y_{1,t-2},\cdots\right.\right]\right)\\
=&MSE\left(\hat{\mathbb{E}}\left[Y_{1,t+s}\left|Y_{1,t},Y_{1,t-1},Y_{1,t-2},\cdots,Y_{2,t},Y_{2,t-1},Y_{2,t-2}\right.\right]\right)
\end{align*}
$$
## 직관
---
만일 어떤 변수 $X$가 다른 변수 $Y$에 대해서 인과관계를 갖는다면, $X$가 먼저 선행해야 함은 분명하다. 뿐만 아니라 단순 선행성에 더해서 $Y$의 과거치만을 가지고 미래값을 예측하는 것보다, $X$의 과거치도 추가해서 $Y$값을 예측하는 것이 더 예측 효과가 좋을 것이 분명하다.


## 검정법
---
귀무가설 $H_0:Y_2\text{ does not Granger-Cause }Y_1$을 검정한다.
$$
y_{1,t}=c_1+\sum_{i=1}^p \alpha_i y_{1,t-i} + \sum_{j=1}^p \beta_j y_{2,t_j}+u_{1,t}\,,\quad t=1,2,\cdots,T
$$
에 대해서 귀무가설은
$$
H_0:\beta_1=\beta_2=\cdots=\beta_p=0
$$
으로 표현된다.

이제 이 귀무가설에 대해 검정통계량은 다음과 같이 표현된다.
$$
F=\frac{(RSS_{H_0}-RSS_{H_1})/p}{RSS_{H_1}/(T-2p-1)}
$$
그러나 이 통계량 $F$는, 독립변수에 시차변수가 포함되어 있기 때문에 $F(p,T-2p-1)$분포를 따르지 않는다. 때문에 실제로는 다음과 같은 왈드 검정통계량을 사용한다.
$$
\Lambda = \frac{T(RSS_{H_0}-RSS_{H_1})}{RSS_{H_1}}\overset{d}{\longrightarrow}\chi^2_{p,\alpha}
$$
이제 이 통계량이 점근적으로 카이제곱분포를 따름을 이용해서, 귀무가설의 기각 여부를 결정한다.

단, 이 검정은 $p$에 따라 매우 민감할 수 있다. 따라서 $p$를 알맞게 선택하는 것이 매우 중요하다. 이를 위해 AIC, BIC 또는 SIC 기준 등을 사용한다.

