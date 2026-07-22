# Three.js 카메라: `PerspectiveCamera` 인자 이해하기

`vite-project/src/ts/c_2.ts`에는 다음 카메라 코드가 있다.

```ts
const camera = new Three.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);

camera.position.z = 5;
```

카메라는 게임 속에 놓인 **눈** 또는 **휴대폰 카메라**라고 생각하면 된다.  
`PerspectiveCamera`는 가까운 물체는 크게, 먼 물체는 작게 보이는 일반적인 원근 카메라다.

## 생성자 인자 4개

```ts
new Three.PerspectiveCamera(fov, aspect, near, far)
```

| 순서 | 이름 | 이 코드의 값 | 쉽게 말하면 |
| --- | --- | --- | --- |
| 1 | `fov` | `75` | 카메라가 보는 시야의 넓이 |
| 2 | `aspect` | `window.innerWidth / window.innerHeight` | 화면의 가로세로 비율 |
| 3 | `near` | `0.1` | 카메라에 너무 가까워서 보이지 않는 경계 |
| 4 | `far` | `1000` | 카메라에서 너무 멀어서 보이지 않는 경계 |

## 1. `fov`: 얼마나 넓게 볼 것인가

```ts
75
```

FOV(Field Of View)는 카메라의 세로 시야각이며 단위는 도(degree)다.

```text
작은 FOV (예: 30)  → 망원렌즈처럼 좁게 봄, 물체가 더 크게 보임
큰 FOV (예: 100) → 광각렌즈처럼 넓게 봄, 물체가 더 작고 멀게 보임
```

`75`는 게임이나 기본 Three.js 예제에서 자주 쓰는 무난한 시야각이다.  
카메라 위치를 바꾸지 않아도 FOV를 크게 하면 더 넓은 범위가 화면에 들어온다.

## 2. `aspect`: 화면 비율에 맞춰 찌그러짐 막기

```ts
window.innerWidth / window.innerHeight
```

`aspect`는 **가로 ÷ 세로**다.

```text
브라우저 크기 1440 × 900 → aspect = 1440 / 900 = 1.6
정사각형 화면 800 × 800 → aspect = 1
```

카메라가 보는 비율과 실제 캔버스의 비율이 다르면 큐브가 가로 또는 세로로 찌그러져 보인다. 그래서 브라우저 화면 크기 비율을 그대로 전달한다.

브라우저 창 크기가 바뀌면 이 값도 갱신해야 한다.

```ts
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
```

`camera.updateProjectionMatrix()`는 바뀐 `aspect`를 카메라의 실제 투영 계산에 반영하는 함수다.

## 3. `near`: 이 거리보다 가까우면 안 보임

```ts
0.1
```

카메라 바로 앞에는 보이지 않는 시작선이 있다. 카메라와의 거리가 `0.1`보다 작으면 물체가 잘려 보이거나 보이지 않는다.

```text
카메라 ─ 0.1 ─────────────────────────── 1000
          ↑ 보이기 시작하는 지점
```

`near`는 0이 될 수 없다. 일반적으로 필요한 만큼 작게 잡되, 지나치게 작게 잡지는 않는 편이 좋다.

## 4. `far`: 이 거리보다 멀면 안 보임

```ts
1000
```

카메라에서 거리가 `1000`보다 멀어진 물체는 렌더링하지 않는다. 멀리 있는 것을 굳이 그리지 않아 성능을 아끼고, 카메라가 표현해야 하는 거리 범위를 정하는 역할이다.

이 예제처럼 작은 큐브 하나를 볼 때는 `1000`이면 충분히 넉넉하다.

## 카메라 위치: `camera.position.z = 5`

새 카메라는 기본적으로 원점 `(0, 0, 0)`에 있다. 새 큐브도 기본적으로 원점에 있다. 둘이 같은 위치면 카메라가 큐브 안에 있게 되어 제대로 보기 어렵다.

```ts
camera.position.z = 5;
```

그래서 카메라를 z축 방향으로 5만큼 옮긴다.

```text
카메라 (0, 0, 5) ───── 5만큼 ───── 큐브 (0, 0, 0)
```

카메라는 기본적으로 z축의 음수 방향, 즉 원점을 향하는 방향을 보고 있으므로 이 상태에서 원점의 큐브가 화면에 들어온다.

## 이 예제의 카메라를 한 문장으로 읽기

```ts
new Three.PerspectiveCamera(75, 화면가로/화면세로, 0.1, 1000)
```

> 세로 시야각은 75도이고, 현재 브라우저 화면 비율에 맞춰 보며, 카메라에서 0.1부터 1000 거리 사이의 물체만 보겠다는 뜻이다.

---

## `WebGLRenderer`: 장면을 실제 화면에 그리기

```ts
const renderer = new Three.WebGLRenderer({ antialias: true });
```

`renderer`는 `scene`과 `camera`를 받아서, 카메라가 본 장면을 브라우저의 픽셀로 그리는 담당자다.

```text
Scene    = 무엇이 있는가
Camera   = 어디서 바라보는가
Renderer = 본 결과를 화면에 그리는가
```

실제로 한 프레임을 그리는 코드는 다음이다.

```ts
renderer.render(scene, camera);
```

### `domElement`: 렌더러가 만든 캔버스

렌더러는 화면에 그릴 `<canvas>` 요소를 만든다. `domElement`로 그 캔버스에 접근할 수 있다.

```ts
document.body.appendChild(renderer.domElement);
```

이 줄이 없으면 렌더링은 진행되어도 캔버스가 문서에 붙지 않아 브라우저에서 보이지 않는다.

### `setSize()`: 캔버스 크기 정하기

```ts
renderer.setSize(window.innerWidth, window.innerHeight);
```

렌더러가 그릴 캔버스의 가로·세로 크기를 브라우저 창 크기로 설정한다. 카메라의 `aspect`도 같은 가로세로 비율을 사용해야 화면이 찌그러지지 않는다.

### `antialias: true`: 모서리를 부드럽게 그리기

`antialias`는 비스듬한 선이나 큐브 모서리가 계단처럼 깨져 보이는 현상을 줄이는 옵션이다.

```text
antialias 없음:  ■■■■
                 ■■■■  (계단처럼 보임)

antialias 있음:  ▓■■■
                 ▓▓■■  (경계가 부드러움)
```

따라서 다음 코드는 "화면에 그리는 렌더러를 만들고, 경계선을 부드럽게 처리하라"는 뜻이다.

```ts
new Three.WebGLRenderer({ antialias: true });
```

경계를 부드럽게 만드는 대신 약간의 그래픽 계산이 추가된다. 작은 학습 예제에서는 보통 `true`로 사용한다.

## `c_2.ts`의 화면 출력 순서

```ts
document.body.appendChild(renderer.domElement); // 캔버스를 페이지에 붙임

function animate() {
  requestAnimationFrame(animate); // 다음 화면을 계속 예약
  cube.rotation.x += 0.01;        // 큐브 상태 변경
  cube.rotation.y += 0.01;
  renderer.render(scene, camera);  // 변경된 장면을 화면에 그림
}

animate();
```

즉 `renderer`는 한 번만 만드는 도구이고, `renderer.render(scene, camera)`를 애니메이션 프레임마다 호출해야 회전하는 큐브가 계속 화면에 갱신된다.
