{
  // DOM 객체
  const $form = document.querySelector('.join-form');
  const $loginId = document.getElementById('loginId');
  const $password = document.getElementById('password');
  const $passwordCheck = document.getElementById('passwordCheck');
  const $phone = document.getElementById('phone');
  const $sendAuthBtn = document.getElementById('sendAuthBtn');
  const $authNumberGroup = document.getElementById('authNumberGroup');
  const $authNumber = document.getElementById('authNumber');
  const $verifyAuthBtn = document.getElementById('verifyAuthBtn');
  const $authTimer = document.getElementById('authTimer');

  // 유효성 검사 패턴
  const idPattern = /^[a-zA-Z0-9]{6,12}$/; // 영문, 숫자 조합 6~12자
  const pwPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,16}$/; // 영문, 숫자, 특수문자 조합 8~16자
  const phonePattern = /^01[016789]\d{7,8}$/; // 휴대폰 번호 형식 (01X-XXXX-XXXX)

  // 인증 관련 변수
  let isPhoneVerified = false; // 휴대폰 인증 완료 여부
  let authTimeoutId = null; // 인증 타이머의 ID (타이머 정리용)
  let isAuthenticating = false; // 인증 진행 중 여부 (인증번호 전송 후 ~ 완료/만료 전)

  // 입력 필드 유효성 검사
  {
    // 아이디 유효성 검사
    $loginId.addEventListener('input', function () {
      const isValid = idPattern.test(this.value);
      toggleValidationUI(this, isValid);
    });

    // 비밀번호 유효성 검사
    $password.addEventListener('input', function () {
      const isValid = pwPattern.test(this.value);
      toggleValidationUI(this, isValid);
    });

    // 비밀번호 확인 검사
    $passwordCheck.addEventListener('input', function () {
      const isValid = this.value === $password.value;
      toggleValidationUI(this, isValid);
    });

    // 핸드폰 번호 유효성 검사
    $phone.addEventListener('input', function () {
      const isValid = phonePattern.test(this.value);
      toggleValidationUI(this, isValid);
      $sendAuthBtn.disabled = !isValid;
    });

    // 인증번호 입력 제한 (숫자만)
    $authNumber.addEventListener('input', function () {
      this.value = this.value.replace(/[^0-9]/g, '').slice(0, 6);
    });
  }

  // 휴대폰 인증 관련
  {
    // 인증번호 전송
    $sendAuthBtn.addEventListener('click', function () {
      if (!phonePattern.test($phone.value)) {
        alert('올바른 휴대폰 번호를 입력해주세요.');
        $phone.focus();
        return;
      }

      // 인증 진행 중 상태로 변경
      isAuthenticating = true;
      resetAuthState();

      // TODO: 서버에 인증번호 전송 요청
      // 성공 시:
      {
        $authNumberGroup.style.display = 'block';
        $authTimer.style.display = 'block';
        startAuthTimer();
        alert('인증번호가 전송되었습니다.');
      }
      // 실패 시:
      /*
      {
        isAuthenticating = false;
        alert('인증번호 전송에 실패했습니다. 다시 시도해주세요.');
      }
      */
    });

    // 인증번호 확인
    $verifyAuthBtn.addEventListener('click', function () {
      if (!isAuthenticating) {
        alert('인증이 만료되었습니다. 다시 시도해주세요.');
        resetAuthState();
        return;
      }

      const authNumber = $authNumber.value;
      if (authNumber.length !== 6) {
        alert('인증번호 6자리를 입력해주세요.');
        return;
      }

      // TODO: 서버에 인증번호 확인 요청
      // 서버 응답 결과에 따른 처리
      // 성공 시:
      {
        completeAuth();
        alert('인증이 완료되었습니다.');
      }
      // 실패 시:
      /*
      {
        alert('인증번호가 일치하지 않습니다.');
        $authNumber.value = '';
        $authNumber.focus();
      }
      */
    });

    // 인증 타이머 (3분)
    function startAuthTimer() {
      let timeLeft = 180;
      clearTimeout(authTimeoutId);

      function updateTimer() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        $authTimer.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;

        if (timeLeft === 0) {
          expireAuth();
          return;
        }

        timeLeft--;
        authTimeoutId = setTimeout(updateTimer, 1000);
      }

      updateTimer();
    }

    // 인증 완료 처리
    function completeAuth() {
      isPhoneVerified = true;
      isAuthenticating = false;
      clearTimeout(authTimeoutId);

      $authTimer.style.display = 'none';
      $authNumberGroup.style.display = 'none';
      $phone.readOnly = true;
      $sendAuthBtn.disabled = true;
    }

    // 인증 만료 처리
    function expireAuth() {
      isAuthenticating = false;
      clearTimeout(authTimeoutId);

      $authTimer.textContent = '인증시간이 만료되었습니다.';
      $authNumber.value = '';
      $sendAuthBtn.disabled = false;
    }

    // 인증 상태 초기화
    function resetAuthState() {
      clearTimeout(authTimeoutId);
      $authNumber.value = '';
      $authTimer.textContent = '';
    }
  }

  // UI 관련 유틸리티 함수
  function toggleValidationUI(element, isValid) {
    if (!isValid) {
      element.classList.add('invalid');
    } else {
      element.classList.remove('invalid');
    }
  }

  // 폼 제출 처리
  {
    $form.addEventListener('submit', function (e) {
      // 아이디 검사
      if (!idPattern.test($loginId.value)) {
        e.preventDefault();
        alert('아이디는 영문, 숫자 조합 6~12자로 입력해주세요.');
        $loginId.focus();
        return;
      }

      // 비밀번호 검사
      if (!pwPattern.test($password.value)) {
        e.preventDefault();
        alert('비밀번호는 영문, 숫자, 특수문자 조합 8~16자로 입력해주세요.');
        $password.focus();
        return;
      }

      // 비밀번호 확인 검사
      if ($password.value !== $passwordCheck.value) {
        e.preventDefault();
        alert('비밀번호가 일치하지 않습니다.');
        $passwordCheck.focus();
        return;
      }

      // 휴대폰 인증 검사
      if (!isPhoneVerified) {
        e.preventDefault();
        alert('휴대폰 인증이 필요합니다.');
        return;
      }
    });
  }
}
