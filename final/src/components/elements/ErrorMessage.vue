<template>
  <div class="error-message">
    <span>Не удаётся выполнить запрос к серверу. Ошибка:</span>
    <span>{{ errorMessage }}</span>
  </div>
</template>

<script>
  export default {
    name: 'ErrorMessage',
    props: ['errorMessage'],
  }
</script>

<style lang="scss">
  .error-message {
    display: block;
    height: 100px;
    text-align: center;
    line-height: 100px;
    color: white;
    font-size: 1.25em;
    background-color: #ff4d5e;
    margin: 25px 0;
  }
</style>