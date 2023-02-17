<template>
  <footer class="footer">
    <div class="container-fluid">
      <div class="row">
        <div class="col-sm-6">
          &copy; {{ new Date().getFullYear() }} {{ $store.state.sys.company }}
        </div>
        <div class="col-sm-6">
          <div class="text-sm-end d-none d-sm-block">
            <a href="https://beian.miit.gov.cn/" target="_blank">{{ $store.state.sys.beian }}</a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>
