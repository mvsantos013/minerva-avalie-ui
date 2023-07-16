<template>
  <footer class="absolute bottom-0 w-full bg-primary-700 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div
        class="flex flex-col lg:flex-row items-center lg:items-start justify-between"
      >
        <p class="text-gray-100">Minerva Avalie</p>
        <p class="text-gray-500">
          <small>Esta aplicação é apenas uma prova de conceito</small>
        </p>
        <ul class="flex text-gray-100">
          <li><a href="#" class="mr-6">Sobre</a></li>
          <!-- <li class="mr-6">
            <a
              href="https://github.com/mvsantos013/minerva-avalie-ui"
              target="_blank"
            >
              Repositório
            </a>
          </li> -->
        </ul>
      </div>
      <p class="mt-4 text-gray-100 text-sm text-center sm:text-left">
        © 2023 Mateus Santos
      </p>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'PageFooter',
}
</script>

<!-- <style lang="postcss" scoped>
footer {
  /* stylelint-disable-next-line */
  background: linear-gradient(
    10deg,
    rgba(42, 91, 128, 1) 0%,
    rgba(84, 130, 165, 1) 35%,
    rgba(110, 153, 188, 1) 100%
  );
}
</style> -->
