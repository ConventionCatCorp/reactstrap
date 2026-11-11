import * as Utils from '../utils';

describe('Utils', () => {
  describe('mapToCssModules', () => {
    describe('without css module', () => {
      it('should return a string', () => {
        expect(Utils.mapToCssModules('btn btn-primary')).toEqual(
          expect.any(String),
        );
      });

      it('should return the classnames it was given, unchanged', () => {
        expect(Utils.mapToCssModules('btn btn-primary')).toBe(
          'btn btn-primary',
        );
      });
    });

    describe('with css module', () => {
      it('should return a string', () => {
        const cssModule = {
          btn: 'a1',
          'btn-success': 'b1',
          'btn-primary': 'c2',
        };
        expect(Utils.mapToCssModules('btn btn-primary', cssModule)).toEqual(
          expect.any(String),
        );
      });

      it('should return the mapped classnames', () => {
        const cssModule = {
          btn: 'a1',
          'btn-success': 'b1',
          'btn-primary': 'c2',
        };
        expect(Utils.mapToCssModules('btn btn-primary', cssModule)).toBe(
          'a1 c2',
        );
      });

      it('should return the original classname when it is not in the map', () => {
        const cssModule = {
          btn: 'a1',
          'btn-success': 'b1',
        };
        expect(Utils.mapToCssModules('btn btn-primary', cssModule)).toBe(
          'a1 btn-primary',
        );
      });
    });
  });

  describe('omit', () => {
    it('should omit keys', () => {
      const input = {
        hello: 'world',
        speed: 'fast',
        size: 'small',
      };
      expect(Utils.omit(input, ['hello'])).toEqual({
        speed: 'fast',
        size: 'small',
      });
    });

    it('should not alter source object', () => {
      const input = {
        hello: 'world',
        speed: 'fast',
        size: 'small',
      };
      expect(Utils.omit(input, ['hello'])).toEqual({
        speed: 'fast',
        size: 'small',
      });
      expect(input).toEqual({
        hello: 'world',
        speed: 'fast',
        size: 'small',
      });
    });

    it('should ignore non-existing keys', () => {
      const input = {
        hello: 'world',
        speed: 'fast',
        size: 'small',
      };
      expect(Utils.omit(input, ['non-existing', 'hello'])).toEqual({
        speed: 'fast',
        size: 'small',
      });
    });

    it('should return a new object', () => {
      const input = {
        hello: 'world',
      };
      // toBe tests equality using `===` and so will test if it's not the same object.
      expect(Utils.omit(input, [])).not.toBe(input);
    });
  });

  describe('getTarget', () => {
    it('should return the result of target if target is a function', () => {
      const data = document.createElement('div');
      const spy = vi.fn(() => data);
      expect(Utils.getTarget(spy)).toBe(data);
      expect(spy).toHaveBeenCalled();
    });

    it('should return all matching elements if allElement param is true', () => {
      const element = document.createElement('div');
      element.innerHTML = `<span class='example'>span 1</span>
       <span class='example'>span 2</span>`;
      document.body.appendChild(element);

      const qsa = vi.spyOn(document, 'querySelectorAll');
      const elements = Utils.getTarget('.example', true);
      expect(elements.length).toEqual(2);
      expect(elements[1].textContent).toEqual('span 2');
      expect(qsa).toHaveBeenCalledWith('.example');
      qsa.mockRestore();
    });

    it('should return elements as array like object if allElement param is true', () => {
      const data = document.createElement('div');
      const spy = vi.fn(() => data);
      const elements = Utils.getTarget(spy, true);
      expect(elements).toHaveProperty('length');
      expect(elements).toContain(data);
      expect(spy).toHaveBeenCalled();
    });

    it('should query the document for the target if the target is a string', () => {
      const element = document.createElement('div');
      element.className = 'thing';
      document.body.appendChild(element);
      const qsa = vi.spyOn(document, 'querySelectorAll');
      expect(Utils.getTarget('.thing')).toEqual(element);
      expect(qsa).toHaveBeenCalledWith('.thing');
      qsa.mockRestore();
    });

    it('should query the document for the id target if the target is a string and could not be found normally', () => {
      const element = document.createElement('div');
      element.setAttribute('id', 'thing');
      document.body.appendChild(element);
      const qsa = vi.spyOn(document, 'querySelectorAll');
      expect(Utils.getTarget('thing')).toEqual(element);
      expect(qsa).toHaveBeenCalledWith('#thing');
      qsa.mockRestore();
    });

    it('should return the input target if it is not a function nor a string', () => {
      const target = document.createElement('div');
      expect(Utils.getTarget(target)).toBe(target);
    });

    it('should not return an error when the target could be identified', () => {
      const element = document.createElement('div');
      element.className = 'thing';
      document.body.appendChild(element);
      expect(() => {
        Utils.getTarget('.thing');
      }).not.toThrow();
    });

    it('should return an error when the target could not be identified', () => {
      const target = 'not a target';
      expect(() => {
        Utils.getTarget(target);
      }).toThrow(
        `The target '${target}' could not be identified in the dom, tip: check spelling`,
      );
    });

    it('should return the value of the `current` object if it is a react Ref object', () => {
      const target = { current: document.createElement('span') };
      expect(Utils.getTarget(target)).toBe(target.current);
    });

    it('should return null if the `current` property of the target is null', () => {
      const target = { current: null };
      expect(Utils.getTarget(target)).toBeNull();
      expect(Utils.getTarget(target, true)).toStrictEqual([]);
    });
  });

  describe('setGlobalCssModule', () => {
    it('should return the mapped classnames', () => {
      const globalCssModule = {
        btn: 'a1',
        'btn-success': 'b1',
        'btn-primary': 'c2',
      };
      Utils.setGlobalCssModule(globalCssModule);
      expect(Utils.mapToCssModules('btn btn-primary')).toBe('a1 c2');
      Utils.setGlobalCssModule(undefined);
    });
  });

  describe('isObject', () => {
    it('should return `true` for objects', () => {
      expect(Utils.isObject([1, 2, 3])).toBe(true);
      expect(Utils.isObject(Object(false))).toBe(true);
      expect(Utils.isObject(new Date())).toBe(true);
      expect(Utils.isObject(new Error())).toBe(true);
      expect(Utils.isObject({ a: 1 })).toBe(true);
      expect(Utils.isObject(Object(0))).toBe(true);
      expect(Utils.isObject(/x/)).toBe(true);
      expect(Utils.isObject(Object('a'))).toBe(true);
      expect(Utils.isObject(document.body)).toBe(true);
    });

    it('should return `false` for non-objects', () => {
      expect(Utils.isObject(0)).toBe(false);
      expect(Utils.isObject(false)).toBe(false);
      expect(Utils.isObject(1)).toBe(false);
    });
  });
});
