import React from "react";
import ReactDOM from "react-dom";
import { shallow, mount, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import App, { Todo, TodoForm, useTodos } from "./App";

configure({ adapter: new Adapter() });

describe("App", () => {
  describe("Todo", () => {
    it("Ejecuta completeTodo cuando clickea Complete", () => {
      const completeTodo = jest.fn();
      const removeTodo = jest.fn();
      const index = 5;
      const todo = {
        isCompleted: true,
        text: "lala",
      };

      const wrapper = shallow(
        <Todo
          completeTodo={completeTodo}
          removeTodo={removeTodo}
          index={index}
          todo={todo}
        />
      );

      wrapper.find("button").at(0).simulate("click");

      expect(completeTodo.mock.calls).toEqual([[5]]);
      expect(removeTodo.mock.calls).toEqual([]);
    });

    it("Ejecuta removeTodo cuando clickea X", () => {
      const completeTodo = jest.fn();
      const removeTodo = jest.fn();
      const index = 5;
      const todo = {
        isCompleted: true,
        text: "lala",
      };

      const wrapper = shallow(
        <Todo
          completeTodo={completeTodo}
          removeTodo={removeTodo}
          index={index}
          todo={todo}
        />
      );

      wrapper.find("button").at(1).simulate("click");

      expect(removeTodo.mock.calls).toEqual([[5]]);
      expect(completeTodo.mock.calls).toEqual([]);
    });
  });

  describe("TodoForm", () => {
    it("Llamar a addTodo cuando el formulario tiene un valor", () => {
      const addTodo = jest.fn();
      const preventDefault = jest.fn();
      const wrapper = shallow(<TodoForm addTodo={addTodo} />);
      wrapper
        .find("input")
        .simulate("change", { target: { value: "¡Mi nuevo todo!" } });
      wrapper.find("form").simulate("submit", { preventDefault });

      expect(addTodo.mock.calls).toEqual([["¡Mi nuevo todo!"]]);
      expect(preventDefault.mock.calls).toEqual([[]]);
    });
  });

  describe("Custom hook: useTodos", () => {
    it("addTodo", () => {
      const Test = (props) => {
        const hook = props.hook();
        return <div {...hook}></div>;
      };
      const wrapper = shallow(<Test hook={useTodos} />);
      let props = wrapper.find("div").props();
      props.addTodo("Texto de prueba");
      props = wrapper.find("div").props();
      expect(props.todos[0]).toEqual({ text: "Texto de prueba" });
    });

    it("completeTodo", () => {
      const Test = (props) => {
        const hook = props.hook();
        return <div {...hook}></div>;
      };
      const wrapper = shallow(<Test hook={useTodos} />);
      let props = wrapper.find("div").props();
      props.completeTodo(0);
      props = wrapper.find("div").props();
      expect(props.todos[0]).toEqual({ text: "Todo 1", isCompleted: true });
    });

    it("removeTodo", () => {
      const Test = (props) => {
        const hook = props.hook();
        return <div {...hook}></div>;
      };
      const wrapper = shallow(<Test hook={useTodos} />);
      let props = wrapper.find("div").props();
      props.removeTodo(0);
      props = wrapper.find("div").props();
      expect(props.todos).toEqual([
        {
          text: "Todo 2",
          isCompleted: false,
        },
        {
          text: "Todo 3",
          isCompleted: false,
        },
      ]);
    });
  });

  describe("App", () => {
    it("App", () => {
      const wrapper = mount(<App />);
      const preventDefault = jest.fn();
      wrapper
        .find("input")
        .simulate("change", { target: { value: "¡Mi todo!" } });
      wrapper.find("form").simulate("submit", { preventDefault });
      const respuesta = wrapper
        .find(".todo")
        .at(0)
        .text()
        .includes("¡Mi todo!");
      expect(respuesta).toEqual(true);
      expect(preventDefault.mock.calls).toEqual([[]]);
    });
  });
});
