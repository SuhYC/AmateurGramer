import * as mat4 from "../lib/gl-matrix/mat4.js"
import * as vec3 from "../lib/gl-matrix/vec3.js"
import {toRadian} from "../lib/gl-matrix/common.js"

"use strict";

function main() {
    const loc_aPosition = 3;
    const loc_aColor = 8;

    const src_vert = `#version 300 es
    layout(location=${loc_aPosition}) in vec4 aPosition;
    layout(location=${loc_aColor}) in vec4 aColor;
    uniform mat4 uMVP;
    out vec4 vColor;
    void main()
    {
        gl_Position = uMVP * aPosition;
        vColor = aColor;
    }`;
    const src_frag = `#version 300 es
    precision mediump float;
    in vec4 vColor;
    out vec4 fColor;
    void main()
    {
        fColor = vColor;
    }`;

    const canvas = document.getElementById('webgl');
    const gl = canvas.getContext("webgl2");
    
    var longitude = document.getElementById('longitude').value; // html에서 longitude의 value 참조
    var latitude = document.getElementById('latitude').value; // html에서 latitude의 value 참조

    


    
    let vertShader = gl.createShader(gl.VERTEX_SHADER);
    let fragShader = gl.createShader(gl.FRAGMENT_SHADER);

    gl.shaderSource(vertShader, src_vert);
    gl.compileShader(vertShader);
    gl.shaderSource(fragShader, src_frag);
    gl.compileShader(fragShader);

    let prog = gl.createProgram();
    gl.attachShader(prog,vertShader);
    gl.attachShader(prog,fragShader);

    gl.linkProgram(prog);
    gl.useProgram(prog);



    let vao = initVertexBuffersofCube({gl, loc_aPosition, loc_aColor});
    
    const w = canvas.width;
    const h = canvas.height;

    function updateScreen(gl,w,h,prog){ // 씬을 초기화하고 재구성합니다.
        
    
        gl.enable(gl.DEPTH_TEST);
    
        gl.clearColor(0,0,0,1);
    
        const loc_MVP = gl.getUniformLocation(prog, 'uMVP');
    
        gl.viewport(0, 0, w/2, h); // 왼쪽 뷰포트를 구성합니다.
    
        let P = mat4.create();
        let V = mat4.create();
        let MVP = mat4.create();
        mat4.perspective(P, toRadian(30), 1, 1, 100);
        mat4.lookAt(V, [30, 30, 30], [0, 0, 0], [0, 1, 0]);
        mat4.multiply(MVP, P, V);
        gl.uniformMatrix4fv(loc_MVP, false, MVP);
    
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
        gl.bindVertexArray(vao); 
        gl.drawArrays(gl.TRIANGLES, 0, 36);  // 왼쪽화면의 정육면체를 그립니다.
        gl.bindVertexArray(null); 
        
        
        var radius = 10; // 원의 반지름
        var theta = toRadian(longitude); // xz평면에서의 z축에 대한 각도
        var phi = toRadian(latitude); // xz평면으로부터 y축에 대한 각도

        vao = initVertexBuffersofCircle({gl, loc_aPosition, loc_aColor, radius, theta});
        
        gl.bindVertexArray(vao);
        gl.drawArrays(gl.LINE_LOOP, 0, 36); // latitude의 변화에 따라 카메라가 이동할 경로를 그리는 원
        gl.bindVertexArray(null); 
        
        vao = initVertexBuffersofCircle2({gl, loc_aPosition, loc_aColor, radius});
        gl.bindVertexArray(vao);
        gl.drawArrays(gl.LINE_LOOP, 0, 36); // longitude의 변화에 따라 이전의 원이 회전할 경로를 그리는 원
        gl.bindVertexArray(null); 

        vao = initVertexBuffersofLine({gl, loc_aPosition, loc_aColor, radius, theta, phi});
        gl.bindVertexArray(vao);
        gl.drawArrays(gl.LINE_LOOP, 0, 2); // 카메라의 위치와 원점을 잇는 선분
        gl.bindVertexArray(null); 

        gl.viewport(w/2, 0, w/2, h); // 오른쪽 뷰포트를 구성합니다.
        
        MVP = mat4.create();
        mat4.perspective(MVP, toRadian(30), 1, 1, 100);

        mat4.translate(MVP, MVP, [0, 0, -10]);
        mat4.rotate(MVP, MVP, toRadian(latitude), [1, 0, 0]);
        mat4.rotate(MVP, MVP, toRadian(longitude), [0, 1, 0]);
        
        gl.uniformMatrix4fv(loc_MVP, false, MVP);

        vao = initVertexBuffersofCube({gl, loc_aPosition, loc_aColor});
        gl.bindVertexArray(vao); 
        gl.drawArrays(gl.TRIANGLES, 0, 36); // 오른쪽 뷰포트의 큐브를 그립니다.
        gl.bindVertexArray(null); 
    }
    updateScreen(gl,w,h,prog); // 초기 설정


    // 이후 html의 이벤트에 맞게 함수 호출
    var longscroll = document.getElementById("longitude"); //longitude의 스크롤을 조절할 시 발생하는 이벤트
    longscroll.addEventListener('change',function(event){
        longitude = document.getElementById('longitude').value;
        document.getElementById("longtext").innerText=document.getElementById('longitude').value;
        updateScreen(gl,w,h,prog); // 변경된 사항에 맞게 업데이트
    })

    var latscroll = document.getElementById("latitude"); // latitude의 스크롤을 조절할 시 발생하는 이벤트
    latscroll.addEventListener('change',function(event){
        latitude = document.getElementById('latitude').value;
        document.getElementById("lattext").innerText=document.getElementById('latitude').value;
        updateScreen(gl,w,h,prog); // 변경된 사항에 맞게 업데이트
    })

    document.addEventListener('keydown',function(event){ // 키보드 입력을 받음.
        const keyName = event.key;

        longitude = document.getElementById('longitude').value;
        latitude = document.getElementById('latitude').value;

        if (keyName === 'ArrowRight') { // 오른 화살표 입력시 longitude 증가
            if(longitude<360){
                longitude++;
            }
            document.getElementById("longitude").value=longitude;
            document.getElementById("longtext").innerText=document.getElementById('longitude').value;
            document.getElementById("text").innerText="RightArrow is pressed";
            updateScreen(gl,w,h,prog); // 변경된 사항에 맞게 업데이트
            return;
        }
        else if (keyName === 'ArrowLeft') { // 왼 화살표 입력시 longitude 감소
            if(longitude>0){
                longitude--;
            }
            document.getElementById("longitude").value=longitude;
            document.getElementById("longtext").innerText=document.getElementById('longitude').value;
            document.getElementById("text").innerText="LeftArrow is pressed";
            updateScreen(gl,w,h,prog); // 변경된 사항에 맞게 업데이트
            return;
        }
        else if (keyName === 'ArrowUp') { // 위 화살표 입력시 latitude 증가
            if(latitude<90){
                latitude++;
            }
            document.getElementById("latitude").value=latitude;
            document.getElementById("lattext").innerText=document.getElementById('latitude').value;
            document.getElementById("text").innerText="UpArrow is pressed";
            updateScreen(gl,w,h,prog); // 변경된 사항에 맞게 업데이트
            return;
        }
        else if (keyName === 'ArrowDown') { // 아래 화살표 입력시 latitude 감소
            if(latitude>-91){
                latitude--;
            }
            document.getElementById("latitude").value=latitude;
            document.getElementById("lattext").innerText=document.getElementById('latitude').value;
            document.getElementById("text").innerText="DownArrow is pressed";
            updateScreen(gl,w,h,prog); // 변경된 사항에 맞게 업데이트
            return;
        }
        return; // 이외의 입력은 무시함
    })

    document.addEventListener('keyup',function(event){ // 키업 이벤트에 대해 하단 문구 지우기
        document.getElementById("text").innerText="";
    })

}

function initVertexBuffersofCube({gl, loc_aPosition, loc_aColor}) // 정육면체의 정보를 저장
{
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao); 


    const verticesColors = new Float32Array([

         1.0,  1.0,  1.0,     1.0,  1.0,  1.0,  
         1.0, -1.0,  1.0,     1.0,  1.0,  1.0,  
         1.0, -1.0, -1.0,     1.0,  1.0,  1.0,  

         1.0,  1.0,  1.0,     1.0,  1.0,  1.0,  
         1.0, -1.0, -1.0,     1.0,  1.0,  1.0,  
         1.0,  1.0, -1.0,     1.0,  1.0,  1.0,  //white

         1.0,  1.0,  1.0,     0.0,  0.0,  1.0, 
         1.0,  1.0, -1.0,     0.0,  0.0,  1.0,  
        -1.0,  1.0, -1.0,     0.0,  0.0,  1.0, 

         1.0,  1.0,  1.0,     0.0,  0.0,  1.0,  
        -1.0,  1.0, -1.0,     0.0,  0.0,  1.0,  
        -1.0,  1.0,  1.0,     0.0,  0.0,  1.0,  //blue

         1.0,  1.0,  1.0,     1.0,  0.0,  0.0,  
        -1.0,  1.0,  1.0,     1.0,  0.0,  0.0,  
        -1.0, -1.0,  1.0,     1.0,  0.0,  0.0,  

         1.0,  1.0,  1.0,     1.0,  0.0,  0.0,  
        -1.0, -1.0,  1.0,     1.0,  0.0,  0.0,  
         1.0, -1.0,  1.0,     1.0,  0.0,  0.0,  //red : z=1 평면에 존재하는 면. * 과제 조건상 longitude=0,latitude=0 일 시 0,0,10에 오른쪽 뷰포트의 카메라가 있어야하므로 이 면이 보이게 됨.

        -1.0, -1.0, -1.0,     1.0,  0.0,  1.0,  
        -1.0, -1.0,  1.0,     1.0,  0.0,  1.0,  
        -1.0,  1.0,  1.0,     1.0,  0.0,  1.0,  

        -1.0, -1.0, -1.0,     1.0,  0.0,  1.0,  
        -1.0,  1.0,  1.0,     1.0,  0.0,  1.0,  
        -1.0,  1.0, -1.0,     1.0,  0.0,  1.0,  //magenta

        -1.0, -1.0, -1.0,     0.0,  1.0,  1.0,  
        -1.0,  1.0, -1.0,     0.0,  1.0,  1.0,  
         1.0,  1.0, -1.0,     0.0,  1.0,  1.0,  

        -1.0, -1.0, -1.0,     0.0,  1.0,  1.0,  
         1.0,  1.0, -1.0,     0.0,  1.0,  1.0,  
         1.0, -1.0, -1.0,     0.0,  1.0,  1.0,  //cyan

        -1.0, -1.0, -1.0,     1.0,  1.0,  0.0,  
         1.0, -1.0, -1.0,     1.0,  1.0,  0.0,  
         1.0, -1.0,  1.0,     1.0,  1.0,  0.0,  

        -1.0, -1.0, -1.0,     1.0,  1.0,  0.0,  
         1.0, -1.0,  1.0,     1.0,  1.0,  0.0,  
        -1.0, -1.0,  1.0,     1.0,  1.0,  0.0,  //yellow
    ]);
    
   
    const vbo = gl.createBuffer();
    
    
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);
    
    const FSIZE = verticesColors.BYTES_PER_ELEMENT;

    gl.vertexAttribPointer(loc_aPosition, 3, gl.FLOAT, false, FSIZE * 6, 0);
    gl.enableVertexAttribArray(loc_aPosition);

    gl.vertexAttribPointer(loc_aColor, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
    gl.enableVertexAttribArray(loc_aColor);

    gl.bindVertexArray(null); 
    gl.disableVertexAttribArray(loc_aPosition);
    gl.disableVertexAttribArray(loc_aColor);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    
    return vao;
}

function initVertexBuffersofCircle({gl, loc_aPosition, loc_aColor, radius, theta}){ // 원1(latitude의 변화에 따라 카메라가 이동하는 경로를 그리는 원)의 정보를 저장.
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao); 

    
    var arr1 = [];
    for(let i = 0;i<36;i++){ // xy평면에 반지름이 radius인 원의 그래프에서 10degree마다 점을 찍고 이를 선분으로 이어 원을 만든뒤, 이를 적절히 회전하여 원하는 위치에 위치시킨다.
        let x = radius * Math.cos(toRadian(10 * i));
        let y = radius * Math.sin(toRadian(10 * i));
        let z = 0.0;
        let vert = vec3.create();
        vec3.set(vert,x,y,z);
        let o = vec3.create();
        vec3.set(o,0.0,y,0.0);
        vec3.rotateY(vert,vert,o,toRadian(90));
        vec3.rotateY(vert,vert,o,theta);
        vec3.rotateX(vert,vert,o,toRadian(180));

        arr1.push(vert[0], vert[1], vert[2], 1.0, 1.0, 0.0);
    }

    const verticesColors = new Float32Array(arr1);
   
    const vbo = gl.createBuffer();
    
    
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);
    
    const FSIZE = verticesColors.BYTES_PER_ELEMENT;

    gl.vertexAttribPointer(loc_aPosition, 3, gl.FLOAT, false, FSIZE * 6, 0);
    gl.enableVertexAttribArray(loc_aPosition);

    gl.vertexAttribPointer(loc_aColor, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
    gl.enableVertexAttribArray(loc_aColor);

    gl.bindVertexArray(null); 
    gl.disableVertexAttribArray(loc_aPosition);
    gl.disableVertexAttribArray(loc_aColor);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    
    return vao;
}

function initVertexBuffersofCircle2({gl, loc_aPosition, loc_aColor, radius}){ // 원1이 따라 회전하는 경로를 그리는 원의 정보를 저장
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao); 

    
    var arr1 = [];
    for(let i = 0;i<36;i++){ // xz평면상에 반지름이 radius인 원의 그래프에서 10degree마다 점을 저장하고 선분을 만든다.
        let x = radius * Math.cos(toRadian(10 * i));
        let z = radius * Math.sin(toRadian(10 * i));

        arr1.push(x, 0.0, z, 1.0, 1.0, 1.0);
    }

    const verticesColors = new Float32Array(arr1);
   
    const vbo = gl.createBuffer();
    
    
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);
    
    const FSIZE = verticesColors.BYTES_PER_ELEMENT;

    gl.vertexAttribPointer(loc_aPosition, 3, gl.FLOAT, false, FSIZE * 6, 0);
    gl.enableVertexAttribArray(loc_aPosition);

    gl.vertexAttribPointer(loc_aColor, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
    gl.enableVertexAttribArray(loc_aColor);

    gl.bindVertexArray(null); 
    gl.disableVertexAttribArray(loc_aPosition);
    gl.disableVertexAttribArray(loc_aColor);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    
    return vao;
}

function initVertexBuffersofLine({gl, loc_aPosition, loc_aColor, radius, theta, phi}){ // 카메라의 위치와 원점을 잇는 선분을 그리는 정보를 저장
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao); 

    let x = radius * Math.cos(phi); // phi 각도에 맞게 xy평면상에 위치시킨다.
    let y = radius * Math.sin(phi);
    let z = 0.0;

    let vert = vec3.create();
    vec3.set(vert,x,y,z);
    let o = vec3.create();
    vec3.set(o,0.0,y,0.0);
    vec3.rotateY(vert,vert,o,toRadian(90));
    vec3.rotateY(vert,vert,o,theta);
    vec3.rotateX(vert,vert,o,toRadian(180));  // theta각도에 맞게 회전시키면서 적절한 위치에 존재하도록 회전한다.

    const verticesColors = new Float32Array([
        0.0, 0.0, 0.0,              1.0, 0.0, 1.0, // mazenta
        vert[0],vert[1],vert[2],    1.0, 0.0, 1.0 // mazenta
    ]);
   
    const vbo = gl.createBuffer();
    
    
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);
    
    const FSIZE = verticesColors.BYTES_PER_ELEMENT;

    gl.vertexAttribPointer(loc_aPosition, 3, gl.FLOAT, false, FSIZE * 6, 0);
    gl.enableVertexAttribArray(loc_aPosition);

    gl.vertexAttribPointer(loc_aColor, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
    gl.enableVertexAttribArray(loc_aColor);

    gl.bindVertexArray(null); 
    gl.disableVertexAttribArray(loc_aPosition);
    gl.disableVertexAttribArray(loc_aColor);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    
    return vao;
}



main();
