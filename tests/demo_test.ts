import { assert } from 'chai';
import CoreApi from '../src/http/CoreApi';

describe('Проверка функционала добавления котов', async () => {
  it('Получение кота по id', async () => {
    const name = 'Магна';

    const response = await CoreApi.getCatById(101894);

    assert.equal(response.data.cat.name, name, 'Имена не соответствуют');
  });

  it('Поиск существующего кота', async () => {
    const expName = 'Бамбино';

    const response = await CoreApi.searchCatByPartName(expName);
    if (response.status === 404) {
      assert.fail(`Кот не найден! Response:\n ${JSON.stringify(response.data, null, 2)}`);
    }

    const actName: string = response.data.cats[0].name;

    assert.ok(actName === expName, `Имя [${actName}] не соответствует ожидаемому [${expName}]`);
  });

  it('Проверка статуса ответа при удалении несуществующего кота', async () => {
    const status: number = 404;

    const response = await CoreApi.removeCat(102422);

    assert.ok(
      response.status === status,
      `Актуальный статус код ${response.status}, ожидался ${status}`
    );
  });

  it('Проверка данных о коте', async () => {
    const cat_exp = {
      id: 1181039,
      name: 'Агат',
      description: 'Агат',
      tags: null,
      gender: 'female',
      likes: 3,
      dislikes: 5,
    };

    const response = await CoreApi.getCatById(101368);

    assert.deepEqual(response.data.cat, cat_exp);
  });

  it('Проверка что все коты из списка женского пола', async () => {
    const catsIdList = [101260, 101323, 101400];
    const gender = `female`;
    const genderList = [];

    // Использование цикла for (последовательное выполнение операций)
    console.time('for');
    for (let i = 0; i < catsIdList.length; i++) {
      const response = await CoreApi.getCatById(catsIdList[i]);
      genderList.push(response.data.cat.gender);
    }
    console.timeEnd('for');

    // // такой перебор не сработает, т.к. это попытка запустить асинхронную функцию
    // // из синхронного контекста .map
    // catsIdList.map(async (id) => {
    //   const response = await CoreApi.getCatById(id);
    //   genderList.push(response.data.cat.gender);
    // });

    // Использование Promise.all (параллельное выполнение операций)
    console.time('Promise.all');
    const responseArray = await Promise.all(catsIdList.map((id) => CoreApi.getCatById(id)));
    for (let i = 0; i < catsIdList.length; i++) {
      const response = responseArray[i];
      genderList.push(response.data.cat.gender);
    }
    console.timeEnd('Promise.all');

    assert.ok(genderList.every((g) => g === gender));
    assert.equal(genderList.length, catsIdList.length * 2);
  });
});
