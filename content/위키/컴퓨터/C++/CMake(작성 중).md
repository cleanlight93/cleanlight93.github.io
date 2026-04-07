---
title: CMake(작성 중)
date: 2025-12-15
tags:
  - Cpp
  - CMake
description: CMake(작성 중)
---
[씹어먹는 C++ - <19 - 2. C++ 프로젝트를 위한 CMake 사용법>](https://modoocode.com/332)

---
## 정의

* CMake는 프로젝트를 어떻게 빌드할지 설명해두는 스크립트 언어이자, 거기서 실제 빌드 시스템(e.g. make, Ninja)을 자동으로 만들어주는 도구. 즉, 빌드 파일을 생성하는 프로그램. 빌드 프로그램이 아님!
* 컴파일러에게 우리는 어떤 파일을 어떤 옵션으로 컴팡리하고, 어디에 있는 라이브러리를 어떻게 링크할지까지 모두 명시를 해주어야 함.
* 이런 일을 매번 명령어로 입력하는 대신 설명서를 하나 만들어 두고, CMake가 그 설명서를 읽어서 빌드 시스템을 만들어 주는 것.

## 단계

* 구성(Configure)
	* `CMakeLists.txt`를 읽어서 프로젝트에 어떤 실행파일과 라이브러리가 있는지, 어느 경로에서 헤더파일을 가져올지, 어떤 외부 라이브러리를 링크할지 등을 파악
* 생성(Generate)
	* 실제로 Make와 같은 빌드 도구가 이해할 수 있는 파일, 즉 `Makefile`을 생성함(CLion에서는 Ninja를 사용함).
	* 그리고 `Makefile`은 `make`를 통해 실행파일을 생성함.

## 사용법

최상위 `CMakeLists.txt`에는 반드시 아래 두 개의 내용이 들어가야 함.

```cmake
# CMake 프로그램의 최소 버전
cmake_minimum_required(VERSION 4.0)

# 프로젝트 정보
project(
	project_name # 프로젝트 이름은 필수 항목. 나머지는 생략 가능
	VERSION 0.1
	DESCRIPTION "예제"
	LANGUAGES CXX) # C프로젝트면 C, C++프로젝트면 CXX 명시. CUDA, OBJC 등 가능하다고.
```

실행파일은 다음과 같이, `add_excutable (program main.cpp)`를 추가해야 함. 이 때, `main.cpp`는 `CMakeLists.txt`와 같은 경로에 있어야 함.

```cmake
# CMake 프로그램의 최소 버전
cmake_minimum_required(VERSION 4.0)

# 프로젝트 정보
project(
	project_name # 프로젝트 이름은 필수 항목. 나머지는 생략 가능
	VERSION 0.1
	DESCRIPTION "예제"
	LANGUAGES CXX) # C프로젝트면 C, C++프로젝트면 CXX 명시. CUDA, OBJC 등 가능하다고.

# 실행파일 생성
add_excutable (program main.cpp)
```