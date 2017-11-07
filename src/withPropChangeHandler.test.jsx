import withPropChangeHandler from "./withPropChangeHandler";

describe("withPropChangeHandler()", () => {
  it("sets the proper displayName", () => {
    expect(withPropChangeHandler(() => null)(() => null).displayName).to.equal(
      "withPropChangeHandler(Component)"
    );

    expect(
      withPropChangeHandler(() => null)(
        Object.assign(() => null, { displayName: "qwe" })
      ).displayName
    ).to.equal("withPropChangeHandler(qwe)");

    expect(
      withPropChangeHandler(() => null)(function qwe() {}).displayName
    ).to.equal("withPropChangeHandler(qwe)");
  });

  it("renders the wrapped component", () => {
    const component = sinon.spy(() => null);

    const SpyWithPropChangeHandler = withPropChangeHandler(
      ["a", "b"],
      () => null
    )(component);

    const TestWrapper = ({ props }) => <SpyWithPropChangeHandler {...props} />;

    const wrapper = mount(<TestWrapper props={{ a: 1, b: 1 }} />);

    const setProps = props => wrapper.setProps({ props });

    setProps({ a: 1 });
    setProps({ a: 1, c: 1 });
    expect(component.args[0][0]).to.deep.equal({ a: 1, b: 1 });
    expect(component.args[1][0]).to.deep.equal({ a: 1 });
    expect(component.args[2][0]).to.deep.equal({ a: 1, c: 1 });
    wrapper.unmount();
  });

  it("calls propChangeHandler on every change if keys argument is null", () => {
    const component = sinon.spy(() => null);

    const propChangeHandler = sinon.spy();

    const SpyWithPropChangeHandler = withPropChangeHandler(
      null,
      propChangeHandler
    )(component);

    expect(propChangeHandler.callCount).to.equal(0);

    const TestWrapper = ({ props }) => <SpyWithPropChangeHandler {...props} />;

    const wrapper = mount(<TestWrapper props={{ a: 1, b: 1 }} />);

    const setProps = props => wrapper.setProps({ props });

    expect(propChangeHandler.callCount).to.equal(1);
    expect(propChangeHandler.args[0]).to.deep.equal([{ a: 1, b: 1 }, {}]);

    setProps({ a: 1 });

    expect(propChangeHandler.callCount).to.equal(2);
    expect(propChangeHandler.args[1]).to.deep.equal([{ a: 1 }, { a: 1, b: 1 }]);

    setProps({ a: 1, c: 1 });

    expect(propChangeHandler.callCount).to.equal(3);
    expect(propChangeHandler.args[2]).to.deep.equal([{ a: 1, c: 1 }, { a: 1 }]);

    setProps({ a: 1, c: 1 });

    expect(propChangeHandler.callCount).to.equal(3);

    wrapper.unmount();

    expect(propChangeHandler.callCount).to.equal(4);
    expect(propChangeHandler.args[3]).to.deep.equal([{}, { a: 1, c: 1 }]);
  });

  it("calls propChangeHandler only when the specified props change", () => {
    const component = sinon.spy(() => null);

    const propChangeHandler = sinon.spy();

    const SpyWithPropChangeHandler = withPropChangeHandler(
      ["a", "b"],
      propChangeHandler
    )(component);

    expect(propChangeHandler.callCount).to.equal(0);

    const TestWrapper = ({ props }) => <SpyWithPropChangeHandler {...props} />;

    const wrapper = mount(<TestWrapper props={{ a: 1, b: 1 }} />);

    const setProps = props => wrapper.setProps({ props });

    expect(propChangeHandler.callCount).to.equal(1);
    expect(propChangeHandler.args[0]).to.deep.equal([{ a: 1, b: 1 }, {}]);

    setProps({ a: 1, b: 2 });

    expect(propChangeHandler.callCount).to.equal(2);
    expect(propChangeHandler.args[1]).to.deep.equal([
      { a: 1, b: 2 },
      { a: 1, b: 1 }
    ]);

    setProps({ a: 3, b: 3 });

    expect(propChangeHandler.callCount).to.equal(3);
    expect(propChangeHandler.args[2]).to.deep.equal([
      { a: 3, b: 3 },
      { a: 1, b: 2 }
    ]);

    setProps({ a: 3, b: 3 });

    expect(propChangeHandler.callCount).to.equal(3);

    setProps({ a: 3, b: 3, c: 1, d: 1 });

    expect(propChangeHandler.callCount).to.equal(3);

    setProps({ a: 3, b: 3, c: 1 });

    expect(propChangeHandler.callCount).to.equal(3);

    setProps({ a: 3, c: 1 });

    expect(propChangeHandler.callCount).to.equal(4);
    expect(propChangeHandler.args[3]).to.deep.equal([
      { a: 3, c: 1 },
      { a: 3, b: 3, c: 1 }
    ]);

    setProps({ a: 3, b: 3, c: 1 });

    expect(propChangeHandler.callCount).to.equal(5);
    expect(propChangeHandler.args[4]).to.deep.equal([
      { a: 3, b: 3, c: 1 },
      { a: 3, c: 1 }
    ]);

    wrapper.unmount();

    expect(propChangeHandler.callCount).to.equal(6);
    expect(propChangeHandler.args[5]).to.deep.equal([{}, { a: 3, b: 3, c: 1 }]);
  });
});

const enhance = withPropChangeHandler(
  ["groupId", "userId"],
  (
    { groupId, userId, loadPosts },
    { groupId: previousGroupId, userId: previousUserId, unloadPosts }
  ) => {
    if (previousGroupId && previousUserId) {
      unloadPosts(previousGroupId, previousUserId);
    }

    if (groupId && userId) {
      loadPosts(groupId, userId);
    }
  }
);

const Posts = enhance(
  ({ posts }) =>
    posts && (
      <div>{posts.map(({ id, content }) => <div key={id}>{content}</div>)}</div>
    )
);
