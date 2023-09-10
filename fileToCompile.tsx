function Foo() {
    return (target: any, prop: any) => {

    }
}

function Observe(nameOfContainerToObserve:string) {
  return (proto: any, methodName: any) => {
    console.log(nameOfContainerToObserve, proto, methodName);
  };
}

@Foo()
export class MyComponent {
  @Observe('bar')
  mutuateList() {
    console.log('Mutation Observer');
  }

  render() {
    return 'Hello world!';
  }
}
