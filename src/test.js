import React from 'react';
import renderer from 'react-test-renderer';
import RichTextToReact from './'
//import SampleData from '../example/src/data'
import SampleRichText from '../example/src/App';

describe('RichTextToReact', () => {
  it('is truthy', () => {
    expect(RichTextToReact).toBeTruthy()
  })
})

test('Matches snapshot', () => {
  const component = renderer.create(
    <SampleRichText />
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});