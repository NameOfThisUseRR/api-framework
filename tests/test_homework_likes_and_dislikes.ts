//импорт необходимых компонентов
import { assert, expect } from 'chai';
import CoreApi from '../src/http/CoreApi';
import LikeApi from '../src/http/LikeApi';

let getRandomInt = (max: number) => Math.floor(Math.random() * max);

describe('Функционал проставления лайков/дизлайков коту', async () => {
  beforeEach(async () => {
  });

  it('Пролайкивание кота', async () => {
    /*в самом тесте только лайкаем кота*/
    let random_cat_id = 102750;
    let set_likes = 3;
    let get_response = await CoreApi.getCatById(random_cat_id);
    console.info('homework_likes_and_dislikes:', 'было лайков:' + get_response.data.cat.likes);
    for (let i = 0; i< set_likes; i++){
      const like_response = await LikeApi.likes(random_cat_id, {like: true});
    }
    get_response = await CoreApi.getCatById(random_cat_id);
    console.info('homework_likes_and_dislikes:', 'стало лайков:' + get_response.data.cat.likes);
  });

  afterEach(async () => {
  });
});