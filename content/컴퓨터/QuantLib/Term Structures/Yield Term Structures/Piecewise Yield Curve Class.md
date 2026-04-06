---
title: Piecewise Yield Curve Class
date: 2026-04-06
tags:
  - QuantLib
  - FICC
  - Cpp
  - Python
  - 수익률곡선
description: Piecewise Yield Curve Class
---
[PiecewiseYieldCurve< Traits, Interpolator, Bootstrap > Class Template Reference](https://www.quantlib.org/reference/class_quant_lib_1_1_piecewise_yield_curve.html#details)

[QuantLib-Pytohn Docs Piecewise](https://quantlib-python-docs.readthedocs.io/en/latest/termstructures.html#piecewise)

---
넘겨받은 RateHelper 인스턴스를 이용해 [[부트스트래핑(Bootstrapping)|부트스트래핑]]을 진행해서 수익률곡선을 산출하는 클래스.

C++에서 생성자(Constructors)는
```C++
PiecewiseYieldCurve (const Date &referenceDate, std::vector< ext::shared_ptr< typename Traits::helper > > instruments, const DayCounter &dayCounter, const std::vector< Handle< Quote > > &jumps={}, const std::vector< Date > &jumpDates={}, const Interpolator &i={}, bootstrap_type bootstrap={})

PiecewiseYieldCurve (const Date &referenceDate, std::vector< ext::shared_ptr< typename Traits::helper > > instruments, const DayCounter &dayCounter, const Interpolator &i, bootstrap_type bootstrap={})

PiecewiseYieldCurve (const Date &referenceDate, std::vector< ext::shared_ptr< typename Traits::helper > > instruments, const DayCounter &dayCounter, bootstrap_type bootstrap)

PiecewiseYieldCurve (Natural settlementDays, const Calendar &calendar, std::vector< ext::shared_ptr< typename Traits::helper > > instruments, const DayCounter &dayCounter, const std::vector< Handle< Quote > > &jumps={}, const std::vector< Date > &jumpDates={}, const Interpolator &i={}, bootstrap_type bootstrap={})

PiecewiseYieldCurve (Natural settlementDays, const Calendar &calendar, std::vector< ext::shared_ptr< typename Traits::helper > > instruments, const DayCounter &dayCounter, const Interpolator &i, bootstrap_type bootstrap={})

PiecewiseYieldCurve (Natural settlementDays, const Calendar &calendar, std::vector< ext::shared_ptr< typename Traits::helper > > instruments, const DayCounter &dayCounter, bootstrap_type bootstrap)
```
이고, 
`Traits, Bootstrap`은 `Discount + LogLinear`, `Discount + Linear`, `ZeroYield + Linear`, `ZeroYield + Cubic`, `ForwardRate + Linear`, `ForwardRate + BackwardFlat`, `ForwardRate + Cubic`, `ForwardRate + ConvexMonotone`,  `ForwardRate + ConvexMonotone + LocalBootstrap` 정도가 사용됨.

`bootstraptraits.hpp`에는 이 매핑이 명시되어 있음.
```C++
Discount      -> InterpolatedDiscountCurve<Interpolator>
ZeroYield     -> InterpolatedZeroCurve<Interpolator>
ForwardRate   -> InterpolatedForwardCurve<Interpolator>
SimpleZeroYield -> InterpolatedSimpleZeroCurve<Interpolator>
```


Python에서 이름으로 export된 목록은 이보다 더 범위가 적음.

```Python
PiecewiseLogLinearDiscount

PiecewiseLogCubicDiscount

PiecewiseLinearZero

PiecewiseCubicZero

PiecewiseLinearForward

PiecewiseSplineCubicDiscount
```

---
* `PiecewiseLogLnearDiscount`는 부트스트래핑시에 $\ln D(t)$, 즉 로그를 취한 할인계수를 선형보간함. 이 결과 도출되는 선도금리는, **구간 별로 동일한 값**으로 나옴. step-function CC forward 방식의 보간방식과 거의 동일하다고 보면 됨(`PiecewiseFlatForward`와는 완전 동일). 할인곡선에서 가장 매끄럽다는 점에서 많이 사용된다고.... 그러니까 대충 아래와 같은 선도금리 형태가 나온다는 말
<center>
<img src= "Pasted image 20260406104347.png" width = "400">
</center>

* `PiecewiseLinearZero`는 무이표금리(Spot Rate)를 선형보간함. linear CC zero 방식의 보간방식과 동일. 위와 달리 선도금리가 동일한 값으로 연속해서 나오지는 않음. 그러나 할인커브는 덜 매끈한 형태.



---
**참고문서**
* [[수익률곡선 개요]]