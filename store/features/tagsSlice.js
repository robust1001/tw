import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {fetchAllTagsAPI, setFollowTagAPI} from '../../api/tags';
import {fetchPosts, syncFollowPosts} from './postsSlice';

const initialState = {
  loading: false,
  sections: [],
  allTags: {
    insertIndex: 0,
    lastPageNo: 0,
    endPage: false,
    list: [],
  },
  srvTags: {
    insertIndex: 0,
    lastPageNo: 0,
    endPage: false,
    list: [],
  },
  reqTags: {
    insertIndex: 0,
    lastPageNo: 0,
    endPage: false,
    list: [],
  },
  followTags: {
    insertIndex: 0,
    lastPageNo: 0,
    endPage: false,
    list: [],
  },
};

export const fetchAllTags = createAsyncThunk(
  '/tags/fetchAllTagsStatus',
  async (payload, thunkAPI) => {
    const response = await fetchAllTagsAPI(
      payload.page,
      payload.screen,
      payload.section,
      payload.search,
    );
    // if (payload.mode == 0)
    //console.log('payload.mode == 0: ', JSON.stringify(response, null, 2));
    return {screen: payload.screen, response};
  },
);

export const setFollowTag = createAsyncThunk(
  '/tags/setFollowTagStatus',
  async (payload, thunkAPI) => {
    try {
      // console.log('payload:', JSON.stringify(payload, null, 2));
      await setFollowTagAPI(payload.tag_id, payload.follow_mode);
      if (payload.follow_mode != -1) {
        thunkAPI.dispatch(fetchPosts({screen: 'followPosts', page: 0}));
      }
      thunkAPI.dispatch(syncFollowPosts(payload));
      return payload;
    } catch (e) {
      console.log(e);
    }
  },
);

export const tagsSlice = createSlice({
  name: 'tags',
  initialState,
  reducers: {
    deleteTag(state, action) {
      const {del_tags} = action.payload;
      // console.log('del_tags:', JSON.stringify(del_tags, null, 2));

      syncDelTag('allTags');
      syncDelTag('srvTags');
      syncDelTag('reqTags');
      syncDelTag('followTags');

      function syncDelTag(type) {
        const newList = state[type].list.filter(
          tag => !del_tags.includes(tag.id),
        );
        state[type].list = newList;
      }
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchAllTags.fulfilled, (state, action) => {
      const {screen, response} = action.payload;
      const data = {
        lastPageNo: response.page_no,
        endPage: response.endPage,
      };
      // console.log('page mode: ', mode);
      // console.log('response111: ', JSON.stringify(response, null, 2));
      let newList = [];
      switch (screen) {
        case 'allTags':
          newList = [...state.allTags.list, ...response.list];
          state.allTags = {
            ...data,
            list: response.page_no == 0 ? response.list : newList,
          };
          break;
        case 'srvTags':
          newList = [...state.srvTags.list, ...response.list];
          state.srvTags = {
            ...data,
            list: response.page_no == 0 ? response.list : newList,
          };
          break;
        case 'reqTags':
          newList = [...state.reqTags.list, ...response.list];
          state.reqTags = {
            ...data,
            list: response.page_no == 0 ? response.list : newList,
          };
          break;
        case 'followTags':
          newList = [...state.followTags.list, ...response.list];
          state.followTags = {
            ...data,
            list: response.page_no == 0 ? response.list : newList,
          };
          break;
      }
    });
    builder.addCase(setFollowTag.fulfilled, (state, action) => {
      // console.log('setFollowTag:', JSON.stringify(action.payload, null, 2));
      const tag_id = action.payload.tag_id;
      const tag_name = action.payload.tag_name;
      const follow_mode = action.payload.follow_mode;

      syncFollows('allTags');
      syncFollows('srvTags');
      syncFollows('reqTags');
      syncFollows('followTags');

      function syncFollows(screen) {
        // console.log('screen:', screen);
        // console.log('tag_id:', tag_id);
        // console.log('tag_name:', tag_name);
        // console.log('follow_mode:', follow_mode);
        // console.log('1---> ', JSON.stringify(state[screen].list, null, 2));
        if (screen == 'followTags') {
          if (follow_mode == -1) {
            let temp = [...state[screen].list];
            const filtered = temp.filter(item => item.id != tag_id);
            state[screen].list = [...filtered];
          } else {
            const tag = {
              id: tag_id,
              tag_name: tag_name,
              follow: [
                {
                  mode: follow_mode,
                },
              ],
            };
            state[screen].list = [...state[screen].list, tag];
          }
        } else {
          const index = state[screen].list.findIndex(item => {
            // console.log('item:', JSON.stringify(item, null, 2));
            // console.log('tag_id:', tag_id);
            return item.id == tag_id;
          });
          // console.log('index:', index);
          if (index == -1) return;
          if (follow_mode != -1) {
            if (state[screen].list[index].follow.length != 0) {
              state[screen].list[index].follow[0].mode = follow_mode;
            } else {
              const follow = {
                mode: follow_mode,
              };
              state[screen].list[index].follow = [follow];
            }
          } else {
            if (state[screen].list[index].follow.length == 0) return;
            state[screen].list[index].follow = [];
          }
        }
        // console.log('2---> ', JSON.stringify(state[screen].list, null, 2));
      }
    });
  },
});

export const {deleteTag} = tagsSlice.actions;

export default tagsSlice.reducer;
