import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {
  createPostAPI,
  deletePostAPI,
  favoritePostAPI,
  fetchPostsAPI,
} from '../../api/posts';
import {deleteTag} from './tagsSlice';
import ENV from '../../env';

const initialState = {
  allPosts: {
    lastPageNo: 0,
    endPage: false,
    list: [],
  },
  followPosts: {
    lastPageNo: 0,
    endPage: false,
    list: [],
  },
  matchPosts: {
    lastPageNo: 0,
    endPage: false,
    list: [],
  },
  myPosts: {
    lastPageNo: 0,
    endPage: false,
    list: [],
  },
  userPosts: {
    lastPageNo: 0,
    endPage: false,
    list: [],
  },
  tagPosts: {
    lastPageNo: 0,
    endPage: false,
    list: [],
  },
  favPosts: {
    lastPageNo: 0,
    endPage: false,
    list: [],
  },
};

export const fetchPosts = createAsyncThunk(
  '/posts/fetchPostsStatus',
  async (payload, thunkAPI) => {
    const response = await fetchPostsAPI(payload);
    return {screen: payload.screen, response};
  },
);

export const createPost = createAsyncThunk(
  '/posts/createPostStatus',
  async (payload, thunkAPI) => {
    try {
      const response = await createPostAPI(payload);
      return response;
    } catch (e) {
      throw e;
    }
  },
);

export const deletePost = createAsyncThunk(
  '/posts/deletePostStatus',
  async (postId, thunkAPI) => {
    const response = await deletePostAPI(postId);
    thunkAPI.dispatch(deleteTag({del_tags: response.del_tags}));

    return {postId, response};
  },
);

export const setFavoritePost = createAsyncThunk(
  '/posts/favoritePostStatus',
  async (payload, thunkAPI) => {
    await favoritePostAPI(payload.taskId, payload.favorite);
    return payload;
  },
);

export const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    clearPostsByType(state, action) {
      state[action.payload] = initialState[action.payload];
    },
    syncFollowPosts(state, action) {
      const {tag_id, tag_name, follow_mode} = action.payload;

      syncFollowTask('allPosts');
      syncFollowTask('favPosts');
      // syncFollowTask('myPosts');
      syncFollowTask('userPosts');
      syncFollowTask('matchPosts');
      syncFollowTask('tagPosts');
      syncFollowTask('followPosts');

      function syncFollowTask(type) {
        let newList;
        if (type == 'followPosts') {
          if (follow_mode != -1) return;

          newList = state[type].list.map(post => {
            const relation = post.relation.map(relation => {
              return {
                ...relation,
                tag: {
                  ...relation.tag,
                  follow:
                    relation.tag_id == tag_id ? [] : [...relation.tag.follow],
                },
              };
            });

            return {
              ...post,
              relation,
            };
          });
          newList = newList.filter(function (post) {
            const len = post.relation;
            temp = post.relation.filter(function (relation) {
              return relation.tag.follow.length != 0;
            });
            return temp.length != 0;
          });
        } else {
          newList = state[type].list.map(post => {
            const relation = post.relation.map(relation => {
              if (relation.tag_id === tag_id) {
                return {
                  ...relation,
                  tag: {
                    ...relation.tag,
                    follow:
                      follow_mode !== -1
                        ? [...relation.tag.follow, {mode: follow_mode}]
                        : [],
                  },
                };
              }
              return relation;
            });

            return {
              ...post,
              relation,
            };
          });
        }
        state[type].list = newList;
      }
    },
  },
  extraReducers: builder => {
    builder.addCase(deletePost.fulfilled, (state, action) => {
      syncDelPost('allPosts');
      syncDelPost('myPosts');
      syncDelPost('tagPosts');

      function syncDelPost(type) {
        const newList = state[type].list.filter(
          post => post.id != action.payload.postId,
        );
        state[type].list = newList;
      }
    });
    builder.addCase(setFavoritePost.fulfilled, (state, action) => {
      const {taskId, favorite, post} = action.payload;
      const userId = ENV.userid;

      syncFavorites('allPosts');
      syncFavorites('followPosts');
      syncFavorites('favPosts');
      // syncFavorites('myPosts');
      syncFavorites('userPosts');
      syncFavorites('matchPosts');
      syncFavorites('tagPosts');

      function syncFavorites(type) {
        const index = state[type].list.findIndex(item => item.id == taskId);

        if (type === 'favPosts') {
          if (index === -1 && favorite) {
            let tempPost = {...post};
            let favoriteItems = [...tempPost.favorite];
            favoriteItems.push({user_id: userId});
            tempPost.favorite = favoriteItems;
            state[type].list = [...state[type].list, tempPost];
          } else {
            const newList = state[type].list.filter(item => item.id !== taskId);
            state[type].list = newList;
          }
        } else {
          if (index === -1) return;

          let favoriteItems = state[type].list[index].favorite;
          if (favorite) {
            favoriteItems.push({user_id: userId});
          } else {
            favoriteItems = favoriteItems.filter(
              item => item.user_id !== userId,
            );
          }
          const newList = [...state[type].list];
          newList[index].favorite = favoriteItems;
          state[type].list = newList;
        }
      }
    });
    builder.addCase(fetchPosts.fulfilled, (state, action) => {
      const {screen, response} = action.payload;
      const data = {
        lastPageNo: response.pageNo,
        endPage: response.endPage,
      };

      switch (screen) {
        case 'allPosts':
          let newList = [...state.allPosts.list, ...response.list];
          state.allPosts = {
            ...data,
            list: response.pageNo == 1 ? response.list : newList,
          };
          break;
        case 'favPosts':
          newList = [...state.favPosts.list, ...response.list];
          state.favPosts = {
            ...data,
            list: response.pageNo == 1 ? response.list : newList,
          };
          break;
        case 'userPosts':
          newList = [...state.userPosts.list, ...response.list];
          state.userPosts = {
            ...data,
            list: response.pageNo == 1 ? response.list : newList,
          };
          break;
        case 'myPosts':
          newList = [...state.myPosts.list, ...response.list];
          state.myPosts = {
            ...data,
            list: response.pageNo == 1 ? response.list : newList,
          };
          break;
        case 'tagPosts':
          newList = [...state.tagPosts.list, ...response.list];
          state.tagPosts = {
            ...data,
            list: response.pageNo == 1 ? response.list : newList,
          };
          break;
        case 'matchPosts':
          newList = [...state.matchPosts.list, ...response.list];
          state.matchPosts = {
            ...data,
            list: response.pageNo == 1 ? response.list : newList,
          };
          break;
        case 'followPosts':
          newList = [...state.followPosts.list, ...response.list];
          state.followPosts = {
            ...data,
            list: response.pageNo == 1 ? response.list : newList,
          };
          break;
        default:
          break;
      }
    });
  },
});

export const {clearPostsByType, syncFollowPosts} = postsSlice.actions;

export default postsSlice.reducer;
