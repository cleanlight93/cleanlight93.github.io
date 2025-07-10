---
title: 내생성 개요
date: 2025-07-10
tags:
  - 내생성
  - 측정오류
  - 선택편향
  - 식별
  - 자기상관
description: 내생성 정리 (개요)노트
---
##### 개요
회귀모형의 내생성(Endogeneity)은 추정량의 **편의(bias)** 를 발생시키거나 추정량의 **불일치성(inconsistency)** 을 초래한다. 구체적으로
$$
\mathbf{y}=\mathbf{X}\beta+\mathbf{u}
$$
의 회귀모형을 보자. 여기서 $\mathbf{y},\mathbf{u}\in\mathbb{R}^n$ 이고, $\mathbf{X}\in \mathbf{M}_{n\times k}$ , 및 $\beta\in\mathbb{R}^k$ 라고 하자. 또한
$$
\mathbf{u}\sim (0,\sigma^2\mathbf{I}_n)
$$
이라고 하자. 내생성이란 독립변수와 오차항 사이에 상관관계가 존재한다는 것으로,
$$
\mathrm{Cov}(\mathbf{X},\mathbf{u})\neq0
$$
로 표현된다. 또는
$$
\mathbb{E}\left[\mathbf{u} \left|\mathbf{X}\right.\right]\neq0
$$
로도 표현할 수 있다. $\mathbb{E}[xu]=\mathbb{E}[x\mathbb{E}[u|x]]$이기 때문.
##### 내생성이 문제가 되는 경우
크게 아래와 같다.
* 측정오류(measurement error) 가 있는 경우
* 유의미한 변수의 생략(omitted variable)이 존재하는 경우
* 선택편향(selection bias)이 존재하는 경우
* 변수가 동시에 결정되는 경우(sinultaneous equation) → **식별문제**

##### 내생성 문제의 해결
* GMM(또는 도구변수)을 사용
* DID, LATE, 사용 가능하다면 RCT, 등을 사용