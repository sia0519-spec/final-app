{
  // DOM 요소
  const $likeBtn = document.querySelector('.like-btn');
  const $deleteBtn = document.querySelector('.delete-btn');
  const $commentForm = document.querySelector('.comment-form');
  const $commentInput = document.querySelector('.comment-input');
  const $commentList = document.querySelector('.comment-list');

  // 좋아요 버튼 클릭
  $likeBtn.addEventListener('click', function () {
    this.classList.toggle('active');
    const $likeCount = this.querySelector('.like-count');
    const currentCount = parseInt($likeCount.textContent);

    // TODO: 서버에 좋아요 토글 처리, 반영된 결과 다시 조회해서 화면 처리
    if (this.classList.contains('active')) {
      $likeCount.textContent = currentCount + 1;
    } else {
      $likeCount.textContent = currentCount - 1;
    }
  });

  // 게시글 삭제
  $deleteBtn.addEventListener('click', function () {
    if (confirm('정말 삭제하시겠습니까?')) {
      // TODO: 서버에 삭제 요청
      location.href = '/free-board/list';
    }
  });

  // 댓글 작성
  $commentForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const content = $commentInput.value.trim();
    if (!content) {
      alert('댓글 내용을 입력해주세요.');
      $commentInput.focus();
      return;
    }

    // TODO: 서버에 댓글 작성 요청
    // 성공 시 댓글 목록 새로고침
  });

  // 댓글 수정
  document.addEventListener('click', function (e) {
    if (e.target.classList.contains('edit-comment-btn')) {
      const $commentArticle = e.target.closest('.comment-article');
      const $commentText = $commentArticle.querySelector('.comment-text');
      const currentText = $commentText.textContent;

      // 이미 수정 중인 상태라면 리턴
      if ($commentArticle.classList.contains('editing')) return;

      // 수정 폼 생성
      const $editForm = document.createElement('form');
      $editForm.className = 'edit-form';
      $editForm.innerHTML = `
          <textarea class="edit-input">${currentText}</textarea>
          <div class="edit-actions">
              <button type="submit" class="save-btn">저장</button>
              <button type="button" class="cancel-btn">취소</button>
          </div>
      `;

      // 수정 상태로 변경
      $commentArticle.classList.add('editing');
      $commentText.style.display = 'none';
      $commentText.after($editForm);

      const $editInput = $editForm.querySelector('.edit-input');
      $editInput.focus();

      // 취소 버튼 클릭
      $editForm.querySelector('.cancel-btn').addEventListener('click', function () {
        $commentArticle.classList.remove('editing');
        $commentText.style.display = '';
        $editForm.remove();
      });

      // 수정 폼 제출
      $editForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const newText = $editInput.value.trim();
        if (!newText) {
          alert('댓글 내용을 입력해주세요.');
          $editInput.focus();
          return;
        }

        // TODO: 서버에 수정 요청
        $commentText.textContent = newText;
        $commentArticle.classList.remove('editing');
        $commentText.style.display = '';
        $editForm.remove();
      });
    }
  });

  // 댓글 삭제
  document.addEventListener('click', function (e) {
    if (e.target.classList.contains('delete-comment-btn')) {
      if (confirm('댓글을 삭제하시겠습니까?')) {
        const $commentItem = e.target.closest('.comment-item');
        // TODO: 서버에 삭제 요청
        $commentItem.remove();
      }
    }
  });
}
