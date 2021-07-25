//импорт необходимых компонентов
import {assert} from 'chai';
import CoreApi from '../src/http/CoreApi';
import LikeApi from '../src/http/LikeApi';

//Сколько лайков и дизлайков нужно поставить
let set_likes = 3;
let set_dislikes = 3;
//Сколько лайков и дизлайков должно быть по итогу
let must_be_likes;
let must_be_dislikes;

let get_response;
let random_cat_id;
let getRandomInt = (max: number) => Math.floor(Math.random() * max);

describe('Функционал проставления лайков/дизлайков коту', async () => {
  beforeEach(async () => {
    /* в beforeEach описываем процесс поиска рандомного кота*/
    //получаем всех существующих котов
    const all_cats_response = await CoreApi.getAllCats();
    if(all_cats_response.status !== 404)
    {
      console.log('homework_likes_and_dislikes:', 'запрос GET /getAllCats выполнился успешно, все коты получены');
      //находим рандомную группу
      let groups_quantity = all_cats_response.data.groups.length;
      let group_id = getRandomInt(groups_quantity);
      //находим рандомного кота
      let cats_quantity = all_cats_response.data.groups[group_id].cats.length;
      let cat_number = getRandomInt(cats_quantity);
      random_cat_id =  all_cats_response.data.groups[group_id].cats[cat_number].id;
      //проверка, что кот существует
      get_response = await CoreApi.getCatById(random_cat_id);
      if(get_response.status !== 404) {
        console.log('homework_likes_and_dislikes:', 'запрос GET /getCatById (id:' + random_cat_id +
          ') выполнился успешно, найденный кот существует');
        let must_be_likes = get_response.data.cat.likes;
        let must_be_dislikes = get_response.data.cat.dislikes;
      } else
      {
        assert.fail(`Произошла ошибка выполнении запроса getCatById`);
      }
    }
    else
    {
      assert.fail(`Произошла ошибка при выполнении запроса getAllCats`);
    }
  });

  it('Пролайкивание кота', async () => {
    /*в самом тесте только лайкаем кота*/
    must_be_likes = get_response.data.cat.likes;
    must_be_dislikes = get_response.data.cat.dislikes;
    for (let i = 0; i < set_likes; i++){
      const like_response = await LikeApi.likes(random_cat_id, {like: true});
      assert.ok(like_response.status === 200);
      must_be_likes++;
    }
    console.log('homework_likes_and_dislikes:', 'поставлено: ' + set_likes +
      ' лайков (id:' + random_cat_id + ')');
  });

  it('Продизлайкивание кота', async () => {
    /*в самом тесте только дизлайкаем кота*/
    must_be_likes = get_response.data.cat.likes;
    must_be_dislikes = get_response.data.cat.dislikes;
    for (let i = 0; i < set_dislikes; i++){
      const dislike_response = await LikeApi.dislikes(random_cat_id, {dislike: true});
      assert.ok(dislike_response.status === 200);
      must_be_dislikes++;
    }
    console.log('homework_likes_and_dislikes:', 'поставлено: ' + set_dislikes +
      ' дизлайков (id:' + random_cat_id + ')');
  });

  afterEach(async () => {
    /*в afterEach проверяем кол-во лайков и дизлайков*/
    //запрашиваем кота заново, с новыми значениями лайков и дизлайков
    get_response = await CoreApi.getCatById(random_cat_id);
    //сравниваем лайки и дизлайки
    assert.equal(get_response.data.cat.likes, must_be_likes, 'Количество лайков не совпадает');
    assert.equal(get_response.data.cat.dislikes, must_be_dislikes, 'Количество дизлайков не совпадает');
    console.log('homework_likes_and_dislikes:', 'количество лайков и дизлайков совпадает');
  });
});