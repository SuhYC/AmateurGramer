# **셔플 알고리즘**



## 개요

입력에 대해 순서를 무작위로 섞는 알고리즘에 대한 질문에 Bubble_sort의 개념을 역으로 적용해 난수를 뽑아 50%의 확률로 인접한 인덱스의 원소와 교환하는 방법을 답으로 제시한 적이 있다.

이 알고리즘은 입력의 크기 N에 대해 N^2회의 교환시도가 이루어져야 적절한 셔플이 가능하다.

이러한 셔플;Bubble_shuffle에 대해 성능이 더 뛰어난 형태로 발전시키고자 한다.



## 계획

교환을 시도하는 인덱스에 대해 다음 인덱스와 교환할지 교환하지 않을 지 50%의 확률로 정하는 Bubble_shuffle과 입력의 크기 N에 대해 0 ~ N-1 의 각 인덱스를 무작위로 뽑아 해당 인덱스와 교환하는 Advanced_shuffle을 비교해보기로 한다.



## Advanced_shuffle

현재 교환하려고 시도하는 인덱스 i 와 입력의 크기 이내의 무작위로 뽑은 인덱스 k에 대해 셔플을 수행한다.



## 연구과정

입력의 크기가 1000인 벡터를 선언하고, 각각의 원소를 인덱스와 동일하게 세팅한 뒤, Bubble_shuffle은 1000^2회, Advanced_shuffle은 1000회 셔플하여 수행시간과 무작위도를 측정한다.

무작위도란, 수행 이전과 비교하여 원소가 바뀐 인덱스 수 / 전체 인덱스 수 로 정의한다.

Bubble_shuffle과 Advanced_shuffle을 각각 수행한 결과를 비교해보기로 한다.


## 결과

먼저 Bubble_shuffle을 수행한 결과이다.

![결과](https://github.com/SuhYC/AmateurGramer/blob/main/shuffle_algorithm/result_shuffle_bubble.png?raw=true)

253ms가 소요되었으며 1000개의 입력 중에 11개만이 원래의 위치에 존재한다.

다음은 Advanced_shuffle을 수행한 결과이다.

![결과](https://github.com/SuhYC/AmateurGramer/blob/main/shuffle_algorithm/result_shuffle_advanced.png?raw=true)

12ms가 소요되었으며 1000개의 입력 중에 3개만이 원래의 위치에 존재한다.

## 분석

1% 내외의 원소를 제외하고 두 알고리즘 모두 셔플이 정상적으로 수행되었음을 알 수 있다.

다만 수행시간에서 큰 차이를 보였다.

Bubble_shuffle의 문제점은 입력의 크기 N에 대해 모든 원소를 1회 셔플한 N회 수행 이후에도, 이전과 비교하여 평균적으로 1칸의 인덱스를 이동하지만,

Advanced_shuffle은 입력의 크기 N에 대해 모든 원소를 1회 셔플한 N회 수행 이후에도 전체적으로 셔플이 완료되기 때문에 더 빠른 시간 내에 셔플이 가능했다.

## 코드

![코드](https://github.com/SuhYC/AmateurGramer/blob/main/shuffle_algorithm/code.png?raw=true)

