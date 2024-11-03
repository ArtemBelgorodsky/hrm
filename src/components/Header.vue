<script>
export default {
  data: () => ({
    text: 'Информационная система: Автоматизированное рабочее место сотрудника отдела кадров',
  }),

  created() {},

  watch: {},

  methods: {},
};
</script>

<template>
  <div class="w-100 header">{{ text }}</div>
</template>

<style scoped>
.header {
  height: 100px;
  background-color: #a5c7e9;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  font-weight: bold;
  color: #fff;
}
</style>
