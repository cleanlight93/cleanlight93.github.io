---
title: 일수계산방식(Day Count Convention)
date: 2025-08-09
tags:
  - 금융
  - FICC
  - FX
description: 일수계산방식(Day Count Convention)
---
기본적으로 이자계산기간의 실제일수는 초일 산입, 말일 불산입으로 계산

이하는 ISDA기준.
1. Actual/365(Fixed): 이자계산기간의 실제일수를 365로 나누어 계산
2. Actual/360: 이자계산기간의 실제일수를 360으로 나누어 계산
3. Actual/Actual ISDA: 이자계산기간의 실제일수를 365일 또는 366일(윤년에 한함)으로 나누어 계산, 즉

$$
\text{DayCount}=\frac{\text{Days not in leap year}}{365}+\frac{\text{Days in leap year}}{366}
$$

4. 30/360: 아래와 같이 계산
   $$
   \text{DayCount}=\frac{360\times\left(Y_2-Y_1\right)+30\times\left(M_2-M_1\right)+(D_2-D_1)}{360}
   $$
   
   여기서 $Y_1$은 이자계산기간 초일이 속하는 년도의 숫자, $Y_2$는 이자계산기간 말일이 속하는 년도의 숫자, $M_1$은 이자계산기간의 초일이 속하는 달의 숫자, $M_2$는 이자계산기간의 말일이 속하는 달의 숫자, $D_1$은 이자계산기간의 초일의 숫자이나 그 날의 숫자가 31일 경우에는 30으로 함. $D_2$는 이자계산기간의 말일의 숫자이나, 그 날의 숫자가 31이고 이자계산기간 초일의 숫자가 29보다 큰 경우에는 30으로 함

5. Actual/Actual ISMA: 아래와 같이 계산
   $$
   \text{DayCount}=\frac{D_2-D_1}{\text{Freq}\times (D_3-D_1)}
   $$
   
   여기서 Freq는 이자계산주기(월)이고 $D_1$은 통상 이자계산기간의 초일, $D_3$은 이자계산기간의 말일이고 $D_2$는 $D_3$과 작거나 같은 날짜

---
1 [위키피디아](https://en.wikipedia.org/wiki/Day_count_convention)참고
2 장외파생상품 청산업무규정 시행세칙 참고([거래소 법무포털 링크](https://rule.krx.co.kr/))

