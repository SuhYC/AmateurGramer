proj2_multiviewport.md << 해당 마크다운 파일을 통해 이미지를 포함한 사용예를 볼 수 있습니다.


1. 파일위치
임의의 폴더 SOMEFOLDER에 대해
SOMEFOLDER/source/proj2.html
SOMEFOLDER/source/proj2.js
SOMEFOLDER/lib/gl-matrix/mat4.js
SOMEFOLDER/lib/gl-matrix/vec3.js
SOMEFOLDER/lib/gl-matrix/common.js

2. 구현사항
 - 월드스페이스의 원점에 변의 길이가 2인 정육면체를 각각의 6면의 색이 다르게 구현.
 - z=1평면상에 존재하는 정육면체의 한 면은 빨간색임. (longitude=latitude=0일때 가변위치카메라의 위치가 0,0,10이므로 빨간면을 보게 됨.)
 - 카메라의 경로를 시각화할 2개의 원 구현, 회전 구현.
 - line of sight(moving camera의 위치와 원점을 잇는 선분)구현, 회전 구현.
 - 왼쪽 캔버스에 Whole scene 구현, fixed camera를 perspective로 구현
 - 오른쪽 캔버스에 moving camera의 시점에서 보이는 scene 구현, 요구사항을 모두 만족하게 구현.
 - slide bar와 arrow key를 이용하여 moving camera controll 가능
 - Left/Right arrow와 slide bar를 이용하여 longitude를 1degree씩 0~360의 범위로 조정 가능
 - Down/Up arrow와 slide bar를 이용하여 latitude를 1degree씩 -90~90의 범위로 조정 가능
 - arrow key를 이용한 수치조절시 slide bar에 즉시 반영 (하단에 눌린 key에 대한 정보 출력)
