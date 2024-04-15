# 차량의 사진에서 번호판 식별하기
python project.

# 요약
흑백처리
노이즈제거
윤곽선검출

# 과정

### 0. 원본 이미지
<img src="https://github.com/SuhYC/AmateurGramer/blob/main/Computer_Vision/car.png" width="500"><br/>
원본이미지.<br/>
<img src="https://github.com/SuhYC/AmateurGramer/blob/main/Computer_Vision/1.png" width="500"><br/>
그대로 출력<br/>

### 1. 흑백처리
<img src="https://github.com/SuhYC/AmateurGramer/blob/main/Computer_Vision/2.png" width="500"><br/>
번호판의 글자는 무채색으로 충분히 검출할 수 있으니 BGR2GRAY를 통하여 흑백처리.

### 2. 블러처리 (노이즈 제거)
<img src="https://github.com/SuhYC/AmateurGramer/blob/main/Computer_Vision/3.png" width="500"><br/>
작은 노이즈들을 제거하기 위해 Gaussian Blur와 Thresholding을 사용.

### 3. 윤곽선 검출
<img src="https://github.com/SuhYC/AmateurGramer/blob/main/Computer_Vision/4.png" width="500"><br/>
findContours를 사용하여 윤곽선 검출

### 4. 폐곡선 검출
<img src="https://github.com/SuhYC/AmateurGramer/blob/main/Computer_Vision/5.png" width="500"><br/>
boundingRect를 사용하여 번호판의 후보 식별

### 5. 필터링
<img src="https://github.com/SuhYC/AmateurGramer/blob/main/Computer_Vision/6.png" width="500"><br/>
4번에서 찾아낸 폐곡선들 중 각 사각형의 넓이, 변의 길이, 사각형 간의 거리, 사각형들이 위치한 각도를 기준으로 고려하여
정확한 번호판의 위치를 선별

### 6. 잘라낸 최종 이미지
<img src="https://github.com/SuhYC/AmateurGramer/blob/main/Computer_Vision/7.png" width="500"><br/>
선별한 번호판의 위치를 이용하여 2번 이미지로부터 번호판 부분을 잘라내어 새로운 이미지 제작
