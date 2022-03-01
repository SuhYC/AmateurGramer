# **CAS를 이용한 자료구조 구현 및 ABA문제 처리**

## ABA Problem이란?

일반적인 데이터에 CAS연산을 수행하는 것은 큰 무리가 없이 lock-free하게 실행할 수 있다.

하지만 여러 개의 데이터가 하나의 집단을 구성하는 자료구조에

같은 방식으로 CAS연산을 수행하게 되면 생기는 문제가 하나 있다.

2개의 리스트를 생각해보자.

사용중인 데이터를 담는 HeadList와

사용이 끝나고 재사용을 기다리는 FreeList가 있다고 하자.

HeadList에는 현재 A - B - C 순으로 연결되어 있다.

이러한 HeadList에 thread 1은 pop()을 요청하여 B - C의 순서로 연결되게 하려고 한다.

하지만 thread 1이 CAS연산을 위해 현재 데이터 A를 저장한 뒤

head가 가리키는 주소가 A면 B로 바꾸도록 요청하기 전

thread 1이 sleep하고 thread B가 동시에 pop()연산을 2회 수행한 후 push(A) 연산을 수행하게 되면

자료구조의 형태가 A - C 로 변화하게 되며

이 상태로 thread 1로 복귀할 시

thread 1에서는 head가 가리키고 있는 주소가 변함없이 A 이므로 head가 가리키는 주소를 B로 변경하게되고

그로 인해 A - C 로 연결된 실제 사용 노드 C의 정보가 자료구조를 이탈하게 되고

HeadList와 FreeList가 동시에 B의 노드만 가리키는 상황이 됩니다.

이러한 자료구조의 붕괴현상을 ABA Problem으로 지칭합니다.

## ABA Problem을 해결하는 방법

ABA Problem을 해결하는 방법은 여러가지가 있으나 그 중에 2가지를 비교해보려고 합니다.

첫번째는 mutex-lock을 이용하여 critical region에 동시에 2개 이상의 thread가 접근할 수 없도록 통제하는 것이고

두번째는 lock-free한 기법으로 stamp를 사용하여 cas연산으로 처리하는 방법입니다.

## cas 연산을 이용한 list

먼저 일반적인 cas연산으로 단순히 가리키고 있는 노드의 상태만 확인하고 cas연산을 수행했을 경우의 코드입니다.

![코드](https://github.com/SuhYC/AmateurGramer/blob/main/multi_thread/ABA/listCAS1.png?raw=true)

이러한 방식으로 처리할 경우 위에서 설명한 ABA Problem이 발생해 일부 노드가 소실되거나

자료구조의 형태가 무너져 무한루프에 빠지게 됩니다.

이러한 문제를 해결하기 위해 64bit 메모리의 실제 사용 주소 영역이 52bit임을 이용하고자 합니다.

실제 사용 주소 52bit를 제외한 나머지 12bit에 현재까지 호출된 push()함수의 횟수를 저장하여

thread가 수행중에 중단되고 다시 재개되었을 때 이러한 중단사실을 알아챌 수 있도록 합니다.

이러한 방식으로 작성한 코드는 다음과 같습니다.

![코드](https://github.com/SuhYC/AmateurGramer/blob/main/multi_thread/ABA/listCAS2.png?raw=true)

push()함수는 "counter + 실제주소" = 저장할 주소 와 같은 형태로 자료구조에 노드의 주소를 저장합니다.

pop()함수는 노드의 실제 주소를 사용해야 하므로 저장되어 있던 주소에서 stamp인 counter부분을 제거하고 리턴합니다.

이러한 방식으로 수행하게 되면 하나의 thread가 중단되고 다시 재개되기 까지

정확히 N * 2^12회의 push() 함수가 호출된게 아니라면 CAS연산 중에 충돌하지 않습니다.

## mutex-lock 방식과 stamp-lock-free 방식의 수행시간 차이

mutex-lock 방식을 사용하게 되면 critical region에 한번에 하나의 thread만 진입할 수 있어

비효율적인 수행을 하게 됩니다.

하지만 lock-free 방식을 사용하여 같은 방식을 수행한다면 critical region에 여러개의 thread가 접근할 수 있어

상대적으로 wait-free하게 수행할 수 있습니다.

mutex-lock으로 구현한 코드는 다음과 같습니다.

![코드](https://github.com/SuhYC/AmateurGramer/blob/main/multi_thread/ABA/mutex_lock.png?raw=true)

mutex-lock의 수행결과는 다음과 같습니다.

![코드](https://github.com/SuhYC/AmateurGramer/blob/main/multi_thread/ABA/mutex_lock_time.png?raw=true)

lock-free로 구현한 코드는 다음과 같습니다.

![코드](https://github.com/SuhYC/AmateurGramer/blob/main/multi_thread/ABA/stamp_CAS.png?raw=true)

lock-free의 수행결과는 다음과 같습니다.

![코드](https://github.com/SuhYC/AmateurGramer/blob/main/multi_thread/ABA/lock_free_time.png?raw=true)


