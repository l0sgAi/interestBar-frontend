<template>
  <div class="post-list">
    <PostCard
      v-for="post in posts"
      :key="post.postId"
      :post-id="post.postId"
      :circle-name="post.circleName"
      :circle-color="post.circleColor"
      :user-name="post.userName"
      :user-color="post.userColor"
      :title="post.title"
      :content="post.content"
      :images="post.images"
      :post-time="post.postTime"
      :like-count="post.likeCount"
      :comment-count="post.commentCount"
      :share-count="post.shareCount"
    />
  </div>
</template>

<script setup>
import PostCard from './PostCard.vue'

defineProps({
  posts: {
    type: Array,
    default: () => []
  }
})
</script>

<style scoped>
.post-list {
  display: flex;
  flex-direction: column;
}
</style>
