window.addEventListener('DOMContentLoaded', (event) => {
  // 商品名クリックでアラートを表示
  document.querySelectorAll('.item-name').forEach((elem) => {
    elem.addEventListener('click', (event) => {
      alert(event.target.innerHTML);
    });
  });

  // 商品追加ボタンのクリックイベント処理
  document.querySelector('.send-button').addEventListener('click', (event) => {
    const text = document.querySelector('.input-text').value;
    fetch('/api/item', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: text })
    }).then(() => {
      // 商品追加後、ページをリロードして反映
      window.location.reload();
    });
  });

  // 商品削除ボタンのクリックイベント処理
  document.querySelectorAll('.item-delete-button').forEach((button) => {
    button.addEventListener('click', (event) => {
      const itemId = event.target.dataset.itemId;
      fetch(`/api/item/${itemId}?_method=DELETE`, {
        method: 'POST'
      }).then(() => {
        // 商品削除後、ページをリロードして反映
        window.location.reload();
      });
    });
  });
});

