---
title: 내생적 신용 창출 모형(Endogenous Credit Model)
date: 2025-12-18
tags:
  - 거시경제학
  - 신용창조
  - 은행
  - 경기변동
  - 화폐
  - 포스트케인지안
description: 내생적 신용 창출 모형(Endogenous Credit Model)
---
## 개요
---
현실에서 화폐 또는 신용은 중앙은행이 전적으로 조절하지 못한다. 은행의 존재로 인해, 경제 내에서 내생적으로 신용은 팽창한다.

1. 은행의 대출은 예금을 창조한다(**loans make deposits**). 즉, 은행은 받은 예금으로 대출을 시행하는 것이 **아니라**, 대출을 새롭게 할 때 차입자에게 새로운 예금을 생성해줌으로써(또는 채권을 발행함으로써) 대출자금을 조달한다.

2. 저축은 투자의 결과이다(**private investment determines private savings**). 투자를 실제로 조달하는 것은 저축이 아니라, 자금조달(financing)이다.

3. 은행은 즉각적이고 불연속적으로 신용을 창조할 수 있다.
	* 은행은 유동성이 낮은 자산(대출)을 유동성이 높은 부채(예금)로 전환하여 신용을 창출한다(**유동성 변환**).
	* 은행은 단기 부채(예금)을 발행하여 장기 자산(대출)에 자금을 조달한다(**만기 변환**).
	* 은행은 일반 대중이 안전하다고 인식하는 부채(예금)을 발행하여 그 자금을 위험한 자산(대출)에 투자함으로써 신용위험을 감수한다(**신용 변환**).

4. 은행은 대출과 금리, 자본 규모를 결정할 때 단순히 이익만을 극대화하지 않는다. 오히려 파산 확률을 가중치로 부여한 기대 자기자본 이익률을 극대화한다. 이에 따라 결과적으로 은행이 책정하는 대출금리는 독점적 경쟁 마크업, 예상되는 차입자의 신용위험, 유동성 및 신용 리스크 프리미엄 등을 모두 합산한 형태를 띄게 된다.

5. 은행의 대출(신용창조) 능력을 제한하는 가장 중요한 요소는 은행이 판단하는 **수익성**과 (대출자에 대한) **지급능력**(solvency)이다. 왜냐하면 자기자본 적정성 비율과 같은 은행의 **대차대조표 규제**가 존재하기 때문이다. 이는 신용 변환과 관련된 제약 요소이다.

6. 또한 은행이 중앙은행으로부터 유동성을 조달할 때 담보로 제공할 수 있는 자산을 얼마나 보유하고 있는지 역시 은행의 신용창출 능력에 대한 제약 요인이다. 이는 유동성 변환과 관련된 제약 요소이다.

7. 마지막으로 기준금리의 조정은 은행으로부터 만기 불일치의 리스크를 상승시킬 수 있는 요인이다. 단기 부채에 더 높은 이자를 지불해야 하지만 이미 시행된 장기 대출로는 수익을 즉시 올리기 어렵기 때문이다.

그러나 대학교에서 배우는 통상적인 DSGE 모형에는 이러한 경제의 내생적인 신용팽창이 포함되어있지 않다. 찾아본 결과, 위에 언급한 [[Banks are not intermediaries of loanable funds and why this matters.pdf|영란은행의 2015년 페이퍼]]와, [[Inside (the) Money Machine - Modeling Liquidity, Maturity and Credit Transformations.pdf|IMF의 2025년 페이퍼]]가 해당 내용들을 모형 안에 통합했다. 천천히 보자. 일단 아카이빙...

또한 이런 내생적 신용 창출을 명시적으로 모형화 한 것은 [[Godley의 Stock–Flow Consistent 모형|포스트 케인지안 문헌]]에서 많이 보인다고...

## IMF(2025) - Inside (the) Money Machine
---
**2025.12.18. 추가**

[[Inside (the) Money Machine - Modeling Liquidity, Maturity and Credit Transformations.pdf|IMF의 2025년 페이퍼]]는 대략 다음과 같은 특징을 가짐.

* 기존 거시경제모형은 은행의 핵심 기능을 제대로 다루지 못했다. 특히 대부자금이론의 전제 하에서 은행을 그저 자금중개 기관으로 간주했다. 이러한 접근 방식은 가계가 소비를 줄여 대출 가능한 자금을 축적해야 한다는 가정을 내포하는데, 이는 현실의 메커니즘과 다르다. 몇 세기 전의 실물경제를 가정한 것과 다름 없는 것이다.
* 은행의 핵심 기능은 위에 언급한대로, **내생적 신용(화폐) 창조**이다. 예금이 사전에 존재하지 않아도 대출 실행시 그 대출을 받은 주체에게 예금의 형태로 돈을 쏴주기 때문에 은행의 대차대조표에는 자산쪽에 대출이 생성됨과 동시에 부채쪽에 예금이 생성된다.
* 특히, 은행은 화폐 창조 과정에서 **다섯 가지 주요 리스크 및 제약**에 직면한다. 
	* Solvency: 은행의 자본건정과 관련된 지급능력 리스크.
	* Liquidity: 은행의 단기부채 상환 능력과 관련된 리스크.
	* Maturity:  단기부채로 장기자산을 조달하며 생기는 만기불일치 리스크.
	* Regulatory Constraints: 자기자본규제, 유동성규제, 중앙은행으로부터의 차입과 관련된 담보적격성 규제, 지급준비금 요건 등
	* Demand Constraints: 금리에 대한 비금융민간부문의 대출탄력성 반응을 포함한 일반적인 거시경제조건
* 기존 연구에는 이를 모두 동시에 다룬 거시-금융 모형은 존재하지 않았다. 이를 최초로 통합을 한 것이 바로 이 페이퍼의 의의이다. 아래는 기존 모형들과 이 페이퍼와의 차이.
	* Bernanke et al. (1999) 및 Carlstrom and Fuerst (1997)의 금융 가속기 모델: 이들은 비대칭 정보가 금융 중개에서 외부 자금 조달 프리미엄(external finance premium)을 유발하는 방식을 보여주었지만, 은행 자체는 본질적으로 Veil로 취급하고 비금융 회사의 순자산에 초점
	* Kiyotaki and Moore (1997): 기업이 대출을 받을 때 담보 제약에 직면하는 상황에 초점. 즉 기업이 중심적.
	* Gertler and Kiyotaki (2010), Cúrdia and Woodford (2010) 등: 은행은 실물 자원(real resources)을 중개함. 은행은 먼저 예금을 **유치하고 나서야** 대출을 하는 기관
	* Gertler and Karadi (2011): 이 DSGE 모델은 은행의 대차대조표가 대출 결정을 제약한다는 점을 특징으로 하지만, 뱅크런 및 유동성 경색 역할이 없음
	* Gertler and Kiyotaki (2015): 뱅크런 가능성을 도입했지만, 중앙은행의 최종 대부자(lender of last resort)로서의 역할이 없음
	* Benes et al. (2014); [[Banks are not intermediaries of loanable funds and why this matters.pdf|Jakab and Kumhof (2015)]]: 은행의 지급능력 리스크(solvency risks)와 내생적 화폐 창조 역할을 다루었으나, 은행이 직면할 수 있는 유동성 및 만기불일치 리스크는 다루지 않았음.

* 한편 [[대차대조표 불황]]에서와 같이 비금융민간기업들의 목적함수 자체가 바뀌어서 '차입수요가 아예 사라져버리는 상황'은 모델링하지 않았음.


---
**참고 문서**
* [[Banks are not intermediaries of loanable funds and why this matters.pdf|Jakab and Kumhof(2015) - Banks are not intermediaries of loanable funds]]
* [[Inside (the) Money Machine - Modeling Liquidity, Maturity and Credit Transformations.pdf|IMF(2025) - Inside (the) Money Machine]]
* [[The Macroeconomics of Shadow Banking.pdf]]
* [[Monetary Transmission through Shadow Banks.pdf]]
* [[Understanding Bank and Nonbank Credit Cycles- A Structural Exploration.pdf]]
* [[Bank Credit and Money Creation in a DSGE Model of a Small Open Economy.pdf]]