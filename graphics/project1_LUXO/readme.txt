proj1_LUXO.md << 해당 마크다운 파일을 통해 이미지를 포함한 사용예를 볼 수 있습니다.


1. 테스트 전 유의사항

과제 공지에 11/1일자 기준으로 최신 업데이트 되어있던 공지를 참고하여
threejsfundamentals-gh-pages 폴더가 구성되어 있었으며
이에 추가로 proj1-skeleton 3.html의 내용으로 적힌 import의 경로를 만족시키기 위해
r134 버전 파일을 다운로드 받아
- SOME_FOLDER/resources/  해당 위치에
three.js 라는 폴더명으로 변경하여 저장한 후 실행하였습니다.
( SOME_FOLDER/resources/three.js/build/three.module.js 의 경로로 참조.)

나머지 사항은 proj1.pdf와 동일한 경로로 지정하였습니다.
 (*실험환경 요약 )
SOME_FOLDER 안에는 3rdparty, proj1, resources 폴더가 존재
proj1폴더 내에는 proj1.html 존재
resources 폴더 내에는 r134버전 파일 폴더 이름을 three.js로 변경하여 저장.

2. 구현사항
 - lower blue arm의 길이 2~7의 범위로 0.1간격으로 조정가능
 - upper blue arm의 길이 2~7의 범위로 0.1간격으로 조정가능
 - base green joint의 각도 -180~180의 범위로 1간격으로 조정가능 // 이하 각 joint에 대한 각도는 -90~90이 demo영상에 적용되어있었으나 proj1.pdf와 동일하게 -180~180의 범위로 적용
 - middle green joint의 각도 -180~180의 범위로 1간격으로 조정가능
 - head green joint의 각도 -180~180의 범위로 1간격으로 조정가능
 - lamp angle 10~90의 범위로 1간격으로 조정가능
 - 위 사항을 만족하는 GUI control pannel 구현
 - demo영상과 동일하게 show helper 설정 체크박스 구현
 - 4개의 3D Object 구현
 - 4개의 3D Object가 각각 castshadow와 receiveshadow가능.
 - 4개의 3D Object로 인한 Room의 Wall에 shadow 구현.

