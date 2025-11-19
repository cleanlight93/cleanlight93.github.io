---
title: Smith-Wilson Yield Curves
date: 2025-11-09
tags:
  - FICC
  - 금융
  - 채권
  - 수익률곡선
  - SmithWilson
  - 보외법
  - 금융공학
description: Smith-Wilson Yield Curves
---
출처는 [Guanhua Li의 게시글](http://gli.lu/2017/12/smith-wilson-yield-curves/)

---

Solvency 2 directive의 article 77에서는 다음과 같이 말하고 있음.

>  *The best estimate shall correspond to the probability-weighted average of future cash-flows, taking account of the time value of money (expected present value of future cash-flows), using the relevant risk-free interest rate term structure.*

즉 다음과 같은 형태.
$$
\text{Best Estimate} = \mathbb{E}\left[\sum_{t}CF_t\times P(t)\right]
$$
여기서 $P(t)$는 만기가 $t$시점인 무이표채의 가격으로서, 이 가격은 EIOPA에서 정한 관련 무위험 이자율 기간구조에 따라 계산된 것. 즉, $P(t)$는 $t$시점의 Spot할인계수.

---
## Smith-Wilson Model

먼저 필요한 세팅은 아래와 같다.
* 국고채권 $i$의 평가일(또는 산출일) 기준의 시장가격 $m_i$가 주어짐($i\in [0,N]$) 이 때 $i$는 만기가 짧은 것부터 긴 것까지 순서대로 나열(ex. 3개월=1, 6개월=2, 9개월=3,...)
* 각 국고채권에 대해 산출일로부터 현금흐름일자 $u_1,u_2,u_3,\cdots,u_J$가 주어짐(단위는 년; ex. 3개월 = 0.25).
* 그리고 각 국고채권 $i$에 대해 위의 현금흐름일자에 대응되는 현금흐름 $c_{i,1},c_{i,2},c_{i,3},\cdots,c_{i,J}$가 주어짐(이 때 표면금리는 YTM과 동일하다고 가정).

이제 Smith Wilson이 제시한 프라이싱 함수는 다음과 같음.
$$
P(t) = e^{-r^{\ast}\times t} + \sum_{i=1}^N \zeta_i \times \left(\sum_{j=1}^J c_{i,j}\times W(t,u_j)\right)\tag{Pricing}
$$
단, 여기서
$$
\sum_{j=1}^J c_{i,j}\times W(t,u_j)\equiv K_i(t)
$$
은 커널함수(kernel function)라고 정의하며, $W(t,u_j)$는 아래와 같이 정의됨.
$$
W(t,u_j)=e^{-r^{\ast}\times(t+u_j)}\left[\alpha \min(t,u_j)-\frac{1}{2}e^{-\alpha \max(t,u_j)}\left(e^{\alpha \min(t,u_j)}-e^{-\alpha \min(t,u_j)}\right)\right]
$$
여기서
* $r^{\ast}$은 UFR(연속복리장기선도금리, continuously compounded ultimate forward rate)이고 이 모수(parameter)는 **모형의 외부**에서 결정되는 값.
* $\alpha$는 수렴속도이며 이 모수 역시 **모형의 외부**에서 결정되는 값.
* $\zeta_i$는 실제 수익률곡선과 피팅(fit)시키기 위한 모형 내의 모수로서 <u><b>우리가 추정해야하는 값</b></u>.

한편 국고채권 $i$의 산출일 기준 시장가격 $m_i$는 기본적으로 다음과 같이 계산될 것.
$$
m_i = \sum_{j=1}^J c_{i,j}\times P(u_j)\tag{mkt}
$$
우리는 $m_i$를 주어진 데이터를 통해 알고 있지만, Spot할인계수인 $P(t)$를 알지 못함. 때문에 우리는 위의 (Pricing)식을 통해 (mkt)식을 아래와 같이 쓸 수 있음.
$$
\begin{align*}
m_i & = \sum_{j=1}^J c_{i,j}P(u_j)\\\
& =\sum_{j=1}^J c_{i,j}\left[e^{-r^{\ast}\times u_j} + \sum_{l=1}^N \zeta_l \times \left(\sum_{k=1}^J c_{i,k}\times W(u_j,u_k)\right)\right]\\
&= \sum_{j=1}^J c_{i,j}e^{-r^{\ast}\times u_j}+\left[\sum_{l=1}^N \zeta_l \times \left(\sum_{k=1}^J c_{i,k}\sum_{j=1}^J\left\{c_{i,j}\times W(u_j,u_k)\right\}\right)\right]\\
&=\sum_{j=1}^J c_{i,j}e^{-r^{\ast}\times u_j}+\left[\sum_{l=1}^N  \left(\sum_{k=1}^J\left\{ \sum_{j=1}^J c_{i,j}\times W(u_j,u_k)\right\}c_{i,k}\right)\zeta_l\right]
\end{align*}
$$

이를 행렬로 바꾸어 표현하면
$$
\begin{align*}
\mathbf{m}&=\mathbf{C}\cdot \mathbf{p}\\
&=\mathbf{C}\cdot \boldsymbol{\mu} + (\mathbf{CWC'})\boldsymbol{\zeta}\\
\end{align*}
$$
로 표현될 수 있음. 이 때
$$
\begin{align*}
\mathbf{m}&=(m_1,m_2,\cdots,m_N)' \in \mathbb{R}^N\\
\mathbf{p}&=(P(u_1),P(u_2),\cdots,P(u_J))'\in \mathbb{R}^J\\
\mathbf{C}&=\{c_{i,j}\}\in \mathbf{M}(\mathbb{R})_{N\times J}\\
\boldsymbol{\mu}&=(\exp(-r^{\ast}\times u_1),\exp(-r^{\ast}\times u_2),\cdots,\exp(-r^{\ast}\times u_J))'\in \mathbb{R}^J\\
\boldsymbol{\zeta}&=(\zeta_1,\zeta_2,\cdots,\zeta_N)'\in \mathbb{R}^N\\
\mathbf{W}&=\{W(u_k,u_j)\}\in \mathbf{M}(\mathbb{R})_{J\times J}
\end{align*}
$$
이제 위의 식에서 아래와 같이 $\boldsymbol{\zeta}$를 얻을 수 있음.
$$
\boldsymbol{\zeta} = (\mathbf{CWC'})^{-1}(\mathbf{m}-\mathbf{C}\boldsymbol{\mu})\tag{est}\in\mathbb{R}^N
$$
이제 주어진 데이터로 이 (est)식을 추정한 이후, 다시 (Pricing)식에다가 추정한 값을 대입하면 만기별로 Spot할인계수들을 구할 수 있음. 즉, 수익률곡선을 피팅할 수 있는 것.

이 $\boldsymbol{\zeta}$를 일단 구한다면, $J$보다 미래시점의 만기인 국고채권에 대해서도 커브를 구축할 수 있음. 이를 위해선 $\mathbf{W}$를 확장할 필요가 있음. $\mathbf{W}$를 더 큰 만기로 확장한 이후에, (Pricing)식에 확장시킨 $W$를 다시 대입해서 더 큰 만기의 $P(t)$를 구할 수 있는 것!

$\alpha$와 $r^{\ast}$는 위에서 정의한대로 각각 수렴속도와 장기선도금리이다. $\alpha$가 커질수록 $r^{\ast}$으로 수렴하는 속도가 빨라진다, 즉, $\alpha$가 커질수록 커브가 위로 움직인다. 아래 그림은 $r^{\ast}=4.114194\%$일 때 $\alpha$의 변화에 따른 커브의 모습([Guanhua Li의 게시글](http://gli.lu/2017/12/smith-wilson-yield-curves/)에서 가져옴).

<center>
	<img src="Pasted image 20251109134058.png">
</center>

또한 $r^{\ast}$는 실제로 관찰된 데이터 '이후'의 커브의 형태를 결정짓는다. 이 역시 출처는 같음.
<center>
	<img src="Pasted image 20251109134401.png">
</center>

---
### 문제점

한편 [비서실장 블로그 글](https://blog.naver.com/modernquant/223177841814?trackingCode=blog_bloghome_searchlist)에 따르면, 장기선도금리(UFR)로 '강제로' 수렴시켜야 하는 외삽법에 의해 보험부채(커브)의 민감도가 LLP(즉 할인율 인풋의 마지막 시장 테너) 민감도로 과도하게 익스포져가 몰리고, LLP직전에 대한 민감도가 LLP 반대방향으로 그릭(Greeks)이 몰려버리는데 이는 오로지 모델링에 의해 발생한 그릭이라고 한다.

또한 더 문제가 되는 부분은 델타 그릭이 몰린 것보다 컨벡시티(감마) 모양이 굉장히 불안정하고 모델의 파라미터에 의한 크로스 감마까지 발생한다고 한다(이 크로스 감마는 헤지가 안 되어 베이시스 리스크라고 한다고 함).

이거는 뭔말인지 잘 모르겠어서 더 공부가 필요해보인다.....

---
### 적용

[금감원 K-ICS 감독원장 제공자료](https://www.fss.or.kr/fss/bbs/B0000318/list.do?menuNo=200760)에 따르면 K-ICS할인율 산출 엑셀파일을 제공한다.

![[FSS_IFRS17 및 K-ICS 금리기간구조(원화)_'25.10.xlsm]]

또한 [[新지급여력제도(K-ICS) 해설서.pdf|新지급여력제도(K-ICS) 해설서]]에서는 구체적인 방법론 적용 지침이 아래와 같이 적혀있다.

* 원화 무위험 금리기간구조는 금융투자협회에서 공시하는 국고채금리(만기수익률;YTM)를 사용한다.
	* 국고채에 비해 금리스왑 금리는 대량거래가 금리 수준에 영향을 미칠 가능성이 크며, 특히 국내 시장에서는 가격이 왜곡되어 있는 특성을 보이기 때문에 금리스왑이 아니라 국고채 금리를 사용한다.
* 국고채 수익률은 금융투자협회에서 공시하는 국고채 만기별 채권시가평가기준수익률(민평5사평균; YTM)을 현물이자율(Spot)로 전환하여 산출하되, YTM을 Spot으로 전환시 Smith-Wilson 보간법을 사용한다.
* 구체적인 생성 순서는 다음과 같다 : ① 시장금리(YTM) 수집 → ② YTM을 LOT시점까지 선도금리로 전환(Smith-Wilson 보간법 사용) → ③ LOT시점 선도금리(A)와 CP시점 장기선도금리(B) 사이는 Smith-Wilson 보간법(보외법)으로 추정 → ④ 선도금리곡선을 현물금리로 변환

그렇다면 YTM을 이용해서 채권의 가격으로 변환 후에 Smith-Wilson 보외법을 사용해야하는데, YTM → Price로 변환시 어떻게 할까? 이 때에는 [[채권단가계산|개별채권의  매매단가]]를 계산하는 식과는 다르게 계산한다.

만기가 국고채의 이자지급주기인 6개월단위로 떨어지는 경우, 즉 만기가 0.5년, 1년, 2년, ..., 50년인 경우에는 자명하게 PAR가 나온다. 즉,
$$
m_{J=j} =1\,,\quad j=0.5,1,2,3,\cdots,50
$$
가 된다. 여기서 $m_{J=j}$는 만기가 $j$인 국고채권의 가격을 뜻한다.

그러나 만기가 6개월단위로 떨어지지 않는 경우, 즉 만기가 0.25년인 경우에는
$$
m_{J=0.25} =\frac{1+YTM/2}{\left(1+\frac{YTM}{2}\times 0.25 \right)}
$$
로 계산되며 만기가 0.75년(0.25년 + 0.5년)인 경우에는
$$
m_{J=0.75} =\frac{YTM/2}{\left(1+\frac{YTM}{2}\times 0.25 \right)}+\frac{1+YTM/2}{\left(1+\frac{YTM}{2}\times 0.75 \right)}
$$

즉, 이런 경우에는 이자지급주기와 상이할 경우 복리할인이 아니라 단리할인으로 계산한다.

구체적으로는 아래와 같이 수식을 계산하게 되어있다.

```Python
def ytm_price(tenor, ytm, freq):
    """
      tenor: 만기 (연 단위)
      ytm: 채권 수익률
      freq: 쿠폰 지급 빈도 (연간 지급 횟수; 0이면 제로쿠폰)
    """
    if freq == 0:
        return 1.0 / ((1 + ytm) ** tenor)
    dt = 1.0 / freq
    price = 0.0
    T = tenor
    tol = 1e-8
    while T > 0:

        if abs(T - tenor) < tol:
            CF = 1 + ytm / freq
        else:
            CF = ytm / freq

        if abs(T/dt - round(T/dt)) < tol:
            DF = (1 + ytm / freq) ** (-T * freq)
        else:
            DF = 1.0 / (1 + ytm * T)
        price += CF * DF
        T -= dt
    return price
```


이제 이렇게 산출한 $\mathbf{m}$와, YTM정보, 현금흐름일자졍보를 이용해 Smith-Wilson 보외법으로 $\boldsymbol{\zeta}$를 계산하면 된다. 이후 (Pricing)식에 의거하여 임의의 만기 $t$에 대해서 Spot금리 및 할인계수를 구할 수 있다.

주어진 시가평가데이터를 기준으로 각 만기별 Spot금리를 구했다면, 이 Spot금리는 연속복리이므로, 이산형으로 변경할 필요가 있다. 이 때에는
$$
r_D=\exp(r_C)-1
$$
와 같이 계산한다.

---
**2025.11.19. 추가**

[[붙임1) 2026년 보험부채 할인요소 적용기준 및 향후 할인율 개선사항 적용일정 등 안내.pdf]]

* 최종관찰만기는 30년으로 확대하되, 10년간 단계적으로 상향
* 최초수렴시점은 60년을 기본으로 설정
* 26년 장기선도금리는 4.30%으로 직전년도와 동일