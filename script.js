const HOME = 'C:\\Users\\JiWoon';   // = 프로젝트의 explore/ 폴더

const body   = document.getElementById('cmd-body');
const output = document.getElementById('cmd-output');
const input  = document.getElementById('cmd-input');
const promptEl = document.getElementById('cmd-prompt');

// explore/ 폴더 구조는 페이지를 열 때 GitHub API로 받아 온다 (push된 내용 기준)
// 폴더 규칙:
//   하위 폴더·파일 → dir에 보이고 cd로 이동
//   about/        → 그 폴더의 설명 페이지. dir에 안 보이고 about 명령어로 열림 ($about)
//   url.txt       → 첫 줄의 주소를 cd로 들어갈 때 새 탭에서 연다. dir에 안 보임 ($url)
//   .gitkeep      → 빈 폴더 유지용. dir에 안 보임
const REPO = 'EmptyBug/EmptyBug.github.io';
const BRANCH = 'main';

let FS = null;   // 불러오기 전에는 null. 폴더는 { }, 파일은 null

async function loadFS() {
  const res = await fetch(`https://api.github.com/repos/${REPO}/git/trees/${BRANCH}?recursive=1`);
  if (!res.ok) throw new Error(res.status);
  const { tree } = await res.json();

  const root = {};
  const urlFiles = [];   // [폴더 객체, url.txt 경로]

  for (const { path, type } of tree) {
    if (!path.startsWith('explore/')) continue;
    const parts = path.split('/').slice(1);
    const name = parts.pop();

    // 부모 폴더 찾기 (about/ 안쪽이면 건너뜀)
    if (parts.includes('about')) continue;
    const parent = parts.reduce((d, n) => d[n] ??= {}, root);

    if (name === 'about' && type === 'tree') parent.$about = true;
    else if (name === 'url.txt')             urlFiles.push([parent, path]);
    else if (name === '.gitkeep')            continue;
    else parent[name] = type === 'tree' ? (parent[name] ?? {}) : null;
  }

  // url.txt는 미리 받아 둔다 (cd 순간에 받으면 새 탭이 팝업 차단됨)
  await Promise.all(urlFiles.map(async ([dir, path]) => {
    const r = await fetch(`https://raw.githubusercontent.com/${REPO}/${BRANCH}/${encodeURI(path)}`);
    if (r.ok) dir.$url = (await r.text()).split('\n')[0].trim();
  }));

  FS = root;
}

const LOADING = '폴더 정보를 불러오는 중입니다.';

// C:\Users 에 들어가면 보여줄 개인정보 (내용은 추후 채우기)
const PROFILE = [
  '이름   : 채지운',
  '소속   : 조선대학교',
];

let cwd = [];   // HOME 기준 현재 경로. 예: ['projects', 'web']

function cwdPath() {
  return [HOME, ...cwd].join('\\');
}

function cwdDir() {
  return cwd.reduce((dir, name) => dir[name], FS);
}

// 폴더의 실제 항목만 ($url 같은 설정 키 제외)
function entries(dir) {
  return Object.entries(dir).filter(([name]) => !name.startsWith('$'));
}

// 명령어 목록: 여기에 추가하면 help에도 자동으로 나온다
const commands = {
  help: {
    desc: '사용 가능한 명령어를 보여줍니다.',
    run: () => Object.entries(commands)
      .map(([name, c]) => name.toUpperCase().padEnd(10) + c.desc)
      .join('\n'),
  },
  clear: {
    desc: '화면을 지웁니다.',
    run: () => { output.textContent = ''; },
  },
  about: {
    desc: '현재 폴더에 대한 설명을 보여줍니다.',
    run: () => {
      if (!FS) return LOADING;
      if (!cwdDir().$about) return '이 폴더에 대한 설명이 아직 없습니다.';
      openAbout();
    },
  },
  dir: {
    desc: '현재 위치의 파일과 폴더를 보여줍니다.',
    run: () => {
      if (!FS) return LOADING;
      const rows = entries(cwdDir()).map(([name, v]) =>
        (v ? '<DIR>' : '').padEnd(10) + name);
      return [` ${cwdPath()} 디렉터리`, '', '<DIR>     .', '<DIR>     ..', ...rows].join('\n');
    },
  },
  cd: {
    desc: '위치를 이동합니다. (cd 폴더, cd ..)',
    run: arg => {
      if (!arg) return cwdPath();
      if (!FS)  return LOADING;

      const next = [...cwd];
      for (const part of arg.split(/[\\/]/).filter(Boolean)) {
        if (part === '.') continue;
        if (part === '..') {
          if (next.length) { next.pop(); continue; }
          return showProfile();   // HOME 위(C:\Users)로 가려 하면 프로필 출력 후 HOME 유지
        }
        const dir = next.reduce((d, n) => d[n], FS);
        const found = entries(dir).find(([n]) => n.toLowerCase() === part.toLowerCase());
        if (!found)    return '지정된 경로를 찾을 수 없습니다.';
        if (!found[1]) return '디렉터리 이름이 올바르지 않습니다.';
        next.push(found[0]);
      }
      cwd = next;
      updatePrompt();

      const url = cwdDir().$url;
      if (url) {
        window.open(url, '_blank');
        return `${url} 을(를) 새 탭에서 엽니다.`;
      }
    },
  },
};

function showProfile() {
  cwd = [];
  updatePrompt();

  const img = document.createElement('img');
  img.src = 'data/face.jpg';
  img.alt = '프로필 사진';
  img.className = 'cmd-photo';
  output.append(img);
  img.addEventListener('load', () => body.scrollTop = body.scrollHeight);

  return [...PROFILE, '', `${HOME} 으로 돌아왔습니다.`].join('\n');
}

function updatePrompt() {
  promptEl.textContent = cwdPath() + '>';
}

function print(text) {
  output.append(text + '\n');
  body.scrollTop = body.scrollHeight;
}

input.addEventListener('keydown', e => {
  if (e.key !== 'Enter') return;

  const line = input.value.trim();
  input.value = '';
  print(promptEl.textContent + line);

  if (line) {
    // cmd처럼 "cd.." 도 "cd .." 로 인식
    const [, name, arg] = line.replace(/^cd(?=\.)/i, 'cd ').match(/^(\S+)\s*(.*)$/);
    const command = commands[name.toLowerCase()];
    const result = command
      ? command.run(arg)
      : `'${name}'은(는) 내부 또는 외부 명령, 실행할 수 있는 프로그램, 또는\n배치 파일이 아닙니다.`;
    // 출력할 게 없는 명령어(clear, cd 등)는 빈 줄도 찍지 않는다
    if (result !== undefined) {
      print(result);
      print('');
    }
  }
});

// 창 아무 곳이나 클릭하면 입력으로 포커스
body.addEventListener('click', () => input.focus());

// 창 공통: 제목 표시줄을 잡고 드래그, ✕로 닫기
let drag = null;   // { win, x, y }

// 누른 창을 맨 위로
let zTop = 10;
function bringToFront(win) {
  win.style.zIndex = ++zTop;
}

function makeWindow(win, onClose) {
  const titlebar = win.querySelector('.cmd-titlebar');
  const closeBtn = win.querySelector('.cmd-close');

  win.addEventListener('mousedown', () => bringToFront(win));

  titlebar.addEventListener('mousedown', e => {
    if (e.target === closeBtn) return;
    e.preventDefault(); // 드래그 중 글자 선택 방지
    const style = getComputedStyle(win);
    drag = {
      win,
      x: e.clientX - (parseFloat(style.left) || 0),
      y: e.clientY - (parseFloat(style.top)  || 0),
    };
    document.body.classList.add('dragging');
  });
  closeBtn.addEventListener('click', onClose);
}

document.addEventListener('mousemove', e => {
  if (!drag) return;
  drag.win.style.left = (e.clientX - drag.x) + 'px';
  drag.win.style.top  = (e.clientY - drag.y) + 'px';
});
document.addEventListener('mouseup', () => {
  drag = null;
  document.body.classList.remove('dragging');
});

// 메인 cmd 창: ✕는 숨기기
const cmd = document.getElementById('cmd');
makeWindow(cmd, () => cmd.style.display = 'none');

// about 창: 현재 폴더의 about/index.html 을 브라우저 모양 창에 띄운다
// 이미 열려 있으면 새로 만들지 않고 내용만 바꾼다 (위치·크기 유지)
let aboutWin = null;

function openAbout() {
  if (!aboutWin) createAboutWin();
  aboutWin.querySelector('.browser-url').textContent = cwdPath() + '\\about\\index.html';
  aboutWin.querySelector('iframe').src = ['explore', ...cwd, 'about', 'index.html'].join('/');
  bringToFront(aboutWin);
}

function createAboutWin() {
  aboutWin = document.createElement('div');
  aboutWin.className = 'browser';
  aboutWin.innerHTML = `
    <div class="cmd-titlebar">
      <span class="browser-tab">about</span>
      <span class="cmd-buttons">
        <span>─</span><span>☐</span><span class="cmd-close">✕</span>
      </span>
    </div>
    <div class="browser-nav">
      <span class="browser-btns">←&nbsp;&nbsp;→&nbsp;&nbsp;⟳</span>
      <span class="browser-url"></span>
    </div>
    <iframe></iframe>`;
  document.body.append(aboutWin);

  makeWindow(aboutWin, () => { aboutWin.remove(); aboutWin = null; });
}

// iframe 안을 누르면 부모에 mousedown이 오지 않으므로, 포커스가 iframe으로 넘어갈 때 그 창을 올린다
window.addEventListener('blur', () => {
  setTimeout(() => {
    const el = document.activeElement;
    if (el && el.tagName === 'IFRAME') bringToFront(el.closest('.browser'));
  });
});

print('help 를 입력하면 사용 가능한 명령어를 볼 수 있습니다.\n');

loadFS().catch(() => print('폴더 정보를 불러오지 못했습니다. 새로고침해 주세요.\n'));
