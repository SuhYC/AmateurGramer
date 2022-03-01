# **Multithread 사용하기** CAS연산


## MultiThread 환경에서 전역변수 _val을 1씩 10만번 증가시키는 함수를 수행한다.

각각의 Thread는 해당 함수 func1()을 호출하며

총 9개의 Thread와 main함수 자체에서 또한 10만번 증가시켜

총 100만회의 증가를 유도한다.



## 일반적인 접근을 통한 연산과 CAS연산의 차이

하나의 Thread가 명령을 수행하는 도중에 sleep되고 다른 Thread가 접근하게 되는 경우가 있다.

이 때 이전에 수행하던 Thread는 아직 데이터를 접근만 하고 증가시키지 못한 경우

다시 sleep에서 깨어나 명령을 재개할 때, 기존에 접근했을 때의 데이터를 기준으로 연산하게 된다.

이때 CompareAndSwap 연산을 사용하게 되면

기존의 데이터와 원하는 결과를 저장해놓고, 쓰기 동작을 수행하기 직전에 기존의 데이터가 변경되지는 않았는지 점검한다.

정상적인 수행이 완료되면 반복문을 탈출하며 수행이 비정상적으로 실패하면 다시 수행한다.

이러한 방법으로 각각의 Thread가 Race condition에서 wait-free하게 연산을 수행할 수 있다.



## func2()를 수행한 결과

![func2](https://github.com/SuhYC/AmateurGramer/blob/main/multi_thread/cas/cas_func2.png?raw=true)

일반적인 접근으로 데이터를 변경했을 경우의 결과 중 하나이다.


## func1()을 수행한 결과

![func2](https://github.com/SuhYC/AmateurGramer/blob/main/multi_thread/cas/cas_func2.png?raw=true)

CAS연산으로 데이터를 변경했을 경우의 결과이다.

## 코드


![코드](https://github.com/SuhYC/AmateurGramer/blob/main/multi_thread/cas/cas1.png?raw=true)

