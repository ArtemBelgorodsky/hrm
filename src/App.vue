<script>
const API_URL_USERS = `https://2d3c489fffbe8e1b.mokky.dev/users`;
const API_URL_POSTS = `https://2d3c489fffbe8e1b.mokky.dev/posts`;

export default {
  data: () => ({
    users: [],
    posts: [],
    postMapping: {},
    newUser: {
      name: '',
      avatar: '',
      post: '',
      birthday: '',
    },
    newPost: {
      name: '',
      price: '',
      toId: '',
    },
    method: '',
    url: '',
    openDialogUsers: false,
    openDialogPosts: false,
    hoverUsers: false,
    hoverPosts: false,
    deleteIconProcess: false,
    deleteIcon: 'mdi-delete',
    currentUser: '',
    filterNameInput: '',
    show: false,
  }),

  created() {
    // загрузка при инициализации
    this.fetchDataUsers();
  },

  watch: {
    posts() {
      this.Post();
    },
  },

  methods: {
    Post() {
      this.posts.forEach((post) => {
        this.postMapping[post.toId] = post.name;
      });
      console.log(this.postMapping);
      this.users.forEach((user) => {
        for (let key in this.postMapping) {
          if (user.id == key) {
            return (user.post = this.postMapping[key]);
          }
        }
      });
    },
    async fetchDataUsers() {
      const urlUsers = `${API_URL_USERS}`;
      this.users = await (await fetch(urlUsers)).json();
      const url = `${API_URL_POSTS}`;
      this.posts = await (await fetch(url)).json();
    },
    async postDataUser() {
      const url = `${API_URL_USERS}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: this.newUser.name,
          avatar: this.newUser.avatar,
          post: this.newUser.post,
          birthday: this.newUser.birthday,
        }),
      });
      const data = await response.json();
      this.fetchDataUsers();
      console.log(data);
    },
    async postDataPost() {
      const post = this.posts.find((post) => post.toId == this.newPost.toId);
      if (post) {
        this.method = 'PATCH';
        this.url = `${API_URL_POSTS}/${post.id}`;
      } else {
        this.method = 'POST';
        this.url = `${API_URL_POSTS}`;
      }
      const response = await fetch(this.url, {
        method: this.method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: this.newPost.name,
          price: this.newPost.price,
          toId: this.newPost.toId,
        }),
      });
      const data = await response.json();
      console.log(data);

      this.fetchDataUsers();
    },
    async deleteData(id) {
      if (this.currentUser.id === id) {
        this.currentUser = '';
      }
      this.deleteIconProcess = true;
      const url = `${API_URL_USERS}/${id}`;
      const responseDel = await fetch(url, {
        method: 'DELETE',
      });
      const data = await responseDel.text();
      this.deleteIconProcess = false;
      this.fetchDataUsers();
      console.log(data);
    },
    async deletePost(id) {
      this.deleteIconProcess = true;
      const url = `${API_URL_POSTS}/${id}`;
      const responseDel = await fetch(url, {
        method: 'DELETE',
      });
      const data = await responseDel.text();
      this.deleteIconProcess = false;
      this.fetchDataUsers();
      console.log(data);
    },
  },

  computed: {
    Icon() {
      if (this.deleteIconProcess) {
        return (this.deleteIcon = 'mdi-loading');
      }
    },
    filteredList: function () {
      const filterNameInput = this.filterNameInput.toLowerCase();
      return this.users.filter((user) => {
        return user.name.toLowerCase().includes(filterNameInput);
      });
    },
  },
};
</script>

<template>
  <Header></Header>
  <div class="mt-5 wrapper">
    <div class="list">
      <div>
        <h2 class="mt-5 mb-5" style="text-align: center">Фильтр сотрудников</h2>
        <div class="input-container">
          <input
            type="text"
            placeholder=" "
            id="inputField"
            v-model="filterNameInput"
          />
          <label for="inputField">Начните вводить имя</label>
        </div>
      </div>
      <h2>Список персонала</h2>
      <v-card class="mx-auto overflow-y-auto card-list w-100" max-height="500">
        <v-list
          v-for="user in filteredList"
          :key="user.id"
          class="list-item"
          :class="{ 'item-current': user.id === currentUser.id }"
          @mouseover="hoverUsers = true"
          @mouseleave="hoverUsers = false"
        >
          <div class="list-item-item">
            <v-list-item
              :prepend-avatar="user.avatar"
              :subtitle="user.post"
              :title="user.name"
              @click="currentUser = user"
              class="text-body-2"
            />
            <transition name="fade">
              <v-icon
                :icon="deleteIcon"
                class="item-delete"
                v-if="hoverUsers"
                color="error"
                @click="deleteData(user.id)"
              ></v-icon>
            </transition>
          </div>
        </v-list>
      </v-card>
      <v-btn
        class="mt-5"
        append-icon="mdi-account-circle"
        prepend-icon="$plus"
        @click="openDialogUsers = true"
      >
        Добавить Сотрудника
        <template v-slot:prepend>
          <v-icon color="success"></v-icon>
        </template>
        <template v-slot:append>
          <v-icon color="warning"></v-icon>
        </template>
        <template v-slot:loader>
          <v-progress-linear indeterminate></v-progress-linear>
        </template>
      </v-btn>

      <v-dialog v-model="openDialogUsers" width="auto">
        <v-card max-width="400" title="Введите данные нового сотрудника">
          <v-form fast-fail @submit.prevent>
            <v-text-field
              v-model="newUser.name"
              :rules="firstNameRules"
              label="Фамилия Имя Отчество"
            ></v-text-field>

            <v-text-field
              v-model="newUser.avatar"
              :rules="lastNameRules"
              label="Ссылка на аватар пользователя"
            ></v-text-field>
            <v-text-field
              v-model="newUser.birthday"
              :rules="lastNameRules"
              :type="'date'"
              label="Выберите дату рождения"
            ></v-text-field>
            <v-btn
              class="mt-2"
              type="submit"
              block
              prevent.default
              @click="(openDialog = false), postDataUser()"
              >Создать</v-btn
            >
          </v-form>
        </v-card>
      </v-dialog>
    </div>
    <div class="form" v-if="currentUser.id">
      <h2>Выбранный сотрудник</h2>
      <v-card class="mx-auto" width="400" max-height="800">
        <v-img :src="currentUser.avatar" cover></v-img>

        <v-card-title>
          {{ currentUser.name }}
        </v-card-title>

        <v-card-subtitle>
          {{ currentUser.post }}
        </v-card-subtitle>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            :icon="show ? 'mdi-chevron-up' : 'mdi-chevron-down'"
            @click="show = !show"
          ></v-btn>
        </v-card-actions>

        <v-expand-transition>
          <div v-show="show">
            <v-divider></v-divider>

            <v-card-text>
              Дата рождения:
              {{ new Date(currentUser.birthday).toLocaleDateString('ru-RU') }}
            </v-card-text>
          </div>
        </v-expand-transition>
      </v-card>
    </div>
    <div v-else class="form"><h2>Выберите сотрудника</h2></div>
  </div>

  <!--Список вакансий на предприятии-->

  <div class="w-100 mt-5 mb-5 razdel">
    <h2>Список вакансий на предприятии</h2>
  </div>
  <div class="posts-wrapper">
    <v-card
      class="mx-auto overflow-y-auto card-list w-100"
      max-height="600"
      max-width="600"
    >
      <v-list
        v-for="post in posts"
        :key="post.id"
        @mouseover="hoverPosts = true"
        @mouseleave="hoverPosts = false"
      >
        <div class="list-item-item">
          <v-list-item
            :subtitle="'Заработная плата:' + ' ' + post.price"
            :title="post.name"
            class="text-body-2"
          />

          <transition name="fade">
            <v-icon
              :icon="deleteIcon"
              class="item-delete"
              v-if="hoverPosts"
              color="error"
              @click="deletePost(post.id)"
            ></v-icon>
          </transition>
        </div>
        <div v-if="post.toId" class="dolsh" :style="{ color: 'red' }">
          Должность занята
        </div>
        <div v-else class="dolsh" :style="{ color: 'green' }">
          Должность свободна
        </div>
      </v-list>
    </v-card>
    <v-btn
      class="mt-5 mb-10"
      append-icon="mdi-account-circle"
      prepend-icon="$plus"
      @click="openDialogPosts = true"
    >
      Добавить Должность
      <template v-slot:prepend>
        <v-icon color="success"></v-icon>
      </template>
      <template v-slot:append>
        <v-icon color="warning"></v-icon>
      </template>
      <template v-slot:loader>
        <v-progress-linear indeterminate></v-progress-linear>
      </template>
    </v-btn>

    <v-dialog v-model="openDialogPosts" width="auto">
      <v-card max-width="400" title="Введите данные новой должности">
        <v-form fast-fail @submit.prevent>
          <v-text-field
            v-model="newPost.name"
            :rules="firstNameRules"
            label="Название должности"
          ></v-text-field>

          <v-text-field
            v-model="newPost.price"
            :rules="lastNameRules"
            label="Введите зарплату"
            type="number"
          ></v-text-field>
          <v-select
            v-model="newPost.toId"
            label="Выберите сотрудника или оставте поле пустым"
            item-title="name"
            item-value="id"
            :items="users"
          ></v-select>
          <v-btn
            class="mt-2"
            type="submit"
            block
            prevent.default
            @click="(openDialog = false), postDataPost()"
            >Добавить</v-btn
          >
        </v-form>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>
.list {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}
.list-header {
  margin-bottom: 40px;
}
.wrapper {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
}
.list-item {
  display: block !important;
}
.list-item-item {
  display: flex;
}
.item-delete {
  margin-left: auto;
  cursor: pointer;
  margin-right: 10px;
  transition: all 0.3s ease;
}
.fade-enter-to,
.fade-leave-to {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.item-current {
  background-color: rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.5);
}
.form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
}
.v-list-item-title {
  font-size: 40px !important;
}

.razdel {
  height: 100px;
  background-color: #a5c7e9;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  font-weight: bold;
  color: #fff;
}

.dolsh {
  margin-left: 15px;
}

.posts-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.input-container {
  position: relative;
  width: 300px;
}

.input-container input {
  width: 100%;
  padding: 15px 20px;
  border: none;
  border-radius: 30px;
  background-color: #ffffff;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  font-size: 16px;
  color: #333;
  transition: box-shadow 0.3s ease;
}

.input-container input:focus {
  outline: none;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.input-container label {
  position: absolute;
  top: 50%;
  left: 20px;
  transform: translateY(-50%);
  color: #999;
  pointer-events: none;
  transition: all 0.3s ease;
}

.input-container input:focus + label,
.input-container input:not(:placeholder-shown) + label {
  top: 0;
  left: 10px;
  font-size: 12px;
  color: #555;
  background-color: #fff;
  padding: 0 5px;
}
</style>
