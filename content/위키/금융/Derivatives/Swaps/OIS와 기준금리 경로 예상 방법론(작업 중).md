---
title: OIS와 기준금리 경로 예상 방법론(작업 중)
date: 2025-11-19
tags:
  - FICC
  - 통화정책
  - 기준금리
  - OIS
  - 수익률곡선
  - 선도금리
description: OIS와 기준금리 경로 예상 방법론(작업 중)
---
* [Market yield expectations and forward yields](https://xuruilong100.github.io/posts/%E5%B8%82%E5%9C%BA%E6%94%B6%E7%9B%8A%E7%8E%87%E9%A2%84%E6%9C%9F%E4%B8%8E%E8%BF%9C%E6%9C%9F%E6%94%B6%E7%9B%8A%E7%8E%87/) ([[Market Yield Expectations and Forward Yields.pdf|해당 페이지 인쇄 - pdf 저장본]])

* [일드커브의 이해 part 2 :Forward 번역( on work) ](https://oikon-mundi.tistory.com/586)

* [[IRS,OIS 계산]]

---
## OIS를 이용한 기준금리 경로 예상
---
### 단순 선도금리

* 향후 기준금리의 방향을 읽을 때 OIS커브의 선도금리를 사용하기도 함
* 그러나 “스왑 선도금리 경로 = 시장 참여자들의 실제 평균 전망”이라고 단정하면 안 됨
* 순수기대가설이 성립하지 않기 때문
* 그러나 OIS에는 신용위험이 거의 없고, 단기금리를 직접 반영한다는 점 때문에, 정책금리 경로를 추정할 때 다른 금리보다 왜곡이 적다고 보는 것이 일반적
* 실제로 선도금리는 미래의 기준금리(또는 시장금리)를 예측하는 데에 좋은 성과를 보이지 않음. 예측이 실제로 맞지는 않는다는 말.
	* 아래는 차례대로 8월 19일 KOFR OIS 커브로 그린 스팟 및 내재스팟커브와, 11월 19일 KOFR OIS 커브로 그린 스팟 및 내재스팟커브임(데이터 출처: 연합인포맥스).
	* [[수익률곡선 개요]] 참고.

<center>
	<img src = "Pasted image 20251119135809.png">
</center>

<center>
	<img src = "Pasted image 20251119135822.png">
</center>

### 선도금리를 기준금리 경로로 재구성
---
* OIS가 암시하는 미래의 익일물(overnight) 경로를 통화정책방향 회의일 기준으로 쪼개서, 기준금리 경로로 재구성하는 절차가 필요함.
* 이는 조금씩 정리해보자.