//импорт необходимых компонентов
import {assert} from 'chai';
import CoreApi from '../src/http/CoreApi';

let getRandomInt = (max: number) => Math.floor(Math.random() * max);
let random_cat_id;
let deleted_cat_name;

describe('Функционал удаления кота', async () => {
  beforeEach(async () => {
    /* в beforeEach описываем процесс поиска рандомного кота*/
    //получаем всех существующих котов
    const response = await CoreApi.getAllCats();
    if(response.status !== 404)
    {
      console.log('homework_deleting:', 'запрос GET /getAllCats выполнился успешно, все коты получены');
      //находим рандомную группу
      let groups_quantity = response.data.groups.length;
      let group_id = getRandomInt(groups_quantity);
      //находим рандомного кота
      let cats_quantity = response.data.groups[group_id].cats.length;
      let cat_number = getRandomInt(cats_quantity);
      random_cat_id =  response.data.groups[group_id].cats[cat_number].id;
      //проверка, что кот существует (пока что :D)
      const checking_response = await CoreApi.getCatById(random_cat_id);
      if(checking_response.status !== 404) {
        console.log('homework_deleting:', 'запрос GET /getCatById (id:' + random_cat_id +
          ') выполнился успешно, найденный кот существует');
        deleted_cat_name = checking_response.data.cat.name;
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

  it('Удаление существующего кота', async () => {
    /*в самом тесте только удаляем кота*/
    const remove_response = await CoreApi.removeCat(random_cat_id);
    assert.ok(remove_response.status === 200);
    console.log('homework_deleting:', 'запрос removeCat (id:' + random_cat_id +
      ') выполнился успешно, кот удалён');
  });

  afterEach(async () => {
    /*в afterEach проверяем, что кот удалён через searchCatByPartName*/
    const search_response = await CoreApi.searchCatByPartName(deleted_cat_name);
    assert.ok(search_response.status === 404);
    if (search_response.status === 404) {
      console.log('homework_deleting:', 'Удаление кота прошло успешно (id:' + random_cat_id + ')');
    } else {
      assert.fail(`Произошла ошибка при выполнении запроса searchCatByPartName`);
    }
  });
});