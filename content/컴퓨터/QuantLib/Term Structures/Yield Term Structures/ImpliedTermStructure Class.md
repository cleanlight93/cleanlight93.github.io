---
title: ImpliedTermStructure Class
date: 2025-09-01
tags:
  - QuantLib
  - FICC
  - Python
  - TermStructure
  - 수익률곡선
  - Cpp
description: ImpliedTermStructure Class
---
[QuantLib documents 중 ImpliedTermSturcture Class 레퍼런스 링크](https://rkapl123.github.io/QLAnnotatedSource/da/db5/class_quant_lib_1_1_implied_term_structure.html)

[파이썬 QuantLib 레퍼런스](https://quantlib-python-docs.readthedocs.io/en/latest/termstructures.html)

에서 보면 아래와 같이 사용함

```Python
ql.ImpliedTermStructure(YieldTermStructure, date)
```

이 때 `YieldTermStructure`은 `Handle< YieldTermStructure >`이어야 하고 `date`는 reference date의 역할을 하여 `ql.Date()` 형식이어야 함.

이 클래스는 사용자가 지정한 새로운 reference date에 맞추어 암묵적으로 곡선을 이동시킴.
여기서 중요한 점은, implied term structure는 <u>원본 term structure의 forward rate, discount factor 등을 그대로 보존하되, 단지 기준 날짜만을 옮겨 해석하는 방식으로 동작</u>한다는 것.

만기일이나 쿠폰 지급일과 같은 실제 캘린더상의 계약 날짜는 원본과 동일하게 유지됨. 그러나, implied term structure에서 기준일이 이동하므로, 그 기준일을 출발점으로 하는 시간 간격(time to maturity, time fraction)이 새롭게 계산됨. 따라서 만기까지의 잔존기간이 달라지고, 그에 따라 discount factor와 forward rate 해석이 달라짐.


---
**참고문서**
* [[수익률곡선 개요]]