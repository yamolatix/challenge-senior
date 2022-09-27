import React from "react";
import { range } from "lodash";

import chai, { expect } from "chai";
import chaiEnzyme from "chai-enzyme";
chai.use(chaiEnzyme());

import { shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
configure({ adapter: new Adapter() });
import { spy, stub, match } from "sinon";
import sinonChai from "sinon-chai";
chai.use(sinonChai);
import faker from "faker";

import Message from "../../react/components/Message";
import Inbox from "../../react/components/Inbox";
import NewMessageForm from "../../react/components/NewMessageForm";

const createRandomMessages = (amount) => {
  return range(0, amount).map((index) => {
    return {
      id: index + 1,
      from: { email: faker.internet.email() },
      to: { email: faker.internet.email() },
      subject: faker.lorem.sentence(),
      body: faker.lorem.paragraph(),
    };
  });
};

const testUtilities = {
  createRandomMessages,
  createOneRandomMessage: () => createRandomMessages(1)[0],
};

describe("▒▒▒ Frontend tests ▒▒▒", function () {
  describe("Message", () => {
    describe("contenido visual", () => {
      // Antes de cada `it` spec, instanciamos un nuevo componente de React `Message`
      // `Message` viene del archivo `react/components/Message.js
      // Este componente va a recibir algo de data en su prop `fullMessage`
      // Guardamos este componente en un wrapper testeable `messageWrapper`

      let messageData, messageWrapper;
      beforeEach("Crea un wrapper para <Message /> ", () => {
        messageData = {
          id: 5,
          from: { email: "hagrid@hogwarts.com" },
          to: { email: "harry@potter.com" },
          subject: "re: New letter!",
          body: "You're a Wizard, Harry!",
        };
        // crea el wrapper testeable del componente
        messageWrapper = shallow(<Message fullMessage={messageData} />);
      });

      // Estos tests son relativamente simples - todo lo que pedimos es que
      // hagas es completar cada JSX tag (h1, h2, etc.) con el string HTML mostrado.

      it('incluye el "FROM" como un h1', () => {
        expect(messageWrapper.find("h1")).to.have.html(
          "<h1>From: <span>hagrid@hogwarts.com</span></h1>"
        );
      });

      it('incluye el "TO" como un h2', () => {
        expect(messageWrapper.find("h2")).to.have.html(
          "<h2>To: <span>harry@potter.com</span></h2>"
        );
      });

      it('incluye el "SUBJECT" como un h3', () => {
        expect(messageWrapper.find("h3")).to.have.html(
          "<h3>Subject: <span>re: New letter!</span></h3>"
        );
      });

      it('incluye el "BODY" como un p', () => {
        expect(messageWrapper.find("p")).to.have.html(
          "<p>You&#39;re a Wizard, Harry!</p>"
        );
      });

      // Estos tests requieren mayor entendimiento de JSX / React.
      // Aquí estamos demostrando que tu método `render` no debería
      // siempre retornar el mismo exacto string en su JSX, en cambio, el resultado
      // debería variar basado en la data pasada. ¿De dónde proviene esa data?
      // ¿Cómo obtenes acceso a él? Volve al `beforeEach` block para verlo.

      it("los valores no estan _harcodeados_", () => {
        const aDifferentMessage = {
          id: 6,
          from: { email: "argusfilch@hogwarts.com" },
          to: { email: "students@hogwarts.com" },
          subject: "rules",
          body: "the forbidden forest is off-limits!",
        };
        // Hacemos un nuevo componente con distinta data, y chequeamos su contenido
        const differentMessageWrapper = shallow(
          <Message fullMessage={aDifferentMessage} />
        );
        expect(differentMessageWrapper.find("h1")).to.have.html(
          "<h1>From: <span>argusfilch@hogwarts.com</span></h1>"
        );
        expect(differentMessageWrapper.find("h2")).to.have.html(
          "<h2>To: <span>students@hogwarts.com</span></h2>"
        );
        expect(differentMessageWrapper.find("h3")).to.have.html(
          "<h3>Subject: <span>rules</span></h3>"
        );
        expect(differentMessageWrapper.find("p")).to.have.html(
          "<p>the forbidden forest is off-limits!</p>"
        );
      });
    });

    describe("interactividad", () => {
      // Ahora construimos un componente `Message` con multiples props.
      // Le estamos pasando una función *spy* dentro de el `markAsRead`
      // prop. Los espias nos permiten testear como una función se utiliza.

      let messageData, messageWrapper, markAsReadSpy;
      beforeEach("Crea <Message />", () => {
        messageData = testUtilities.createOneRandomMessage();
        // http://sinonjs.org/docs/#spies
        markAsReadSpy = spy();
        messageWrapper = shallow(
          <Message fullMessage={messageData} markAsRead={markAsReadSpy} />
        );
      });
      // Lee ambas, la descripción y los `expect`s cuidadosamente. Deberías saber
      // como agregar un click handler que llame a la función con los argumentos
      // específicos

      it("cuando clickeamos, invoca una función pasada como la propiedad markAsRead con el id del mensaje", () => {
        // La función pasada al `markAsRead` no debería ser llamada inmediatamente.
        expect(markAsReadSpy).not.to.have.been.called;

        // Esto va a disparar los onClick handlers registrados en el componente
        messageWrapper.simulate("click");

        // Cuando el componente es clickeado, queremos que la función pasada a
        // `markAsRead` sea invocada.
        expect(markAsReadSpy).to.have.been.called;
        // No solo invocada, pero invocada con los argumentos correctos.
        expect(markAsReadSpy).to.have.been.calledWith(messageData.id);
      });
    });
  });

  describe("Inbox", () => {
    const state = { value: null, stub: null };

    // Primero mockeamos la funcionalidad de useState para controlarla
    before("Mock useState", () => {
      if (state.stub) return;
      function modifier(newState) {
        if (typeof newState === "function") state.value = newState(state);
        else state.value = newState;
      }
      // Un stub nos permite remplazar un funcion por un mock nuestro,
      // y de esa forma controlar su comportamiento.
      state.stub = stub(React, "useState").callsFake((initialValue) => {
        if (!state.value) state.value = initialValue;
        return [state.value, modifier];
      });
    });

    after(function () {
      // Limpiamos el mock luego de su uso.
      React.useState.restore();
    });

    let randomMessages;
    beforeEach("Crea ejemplos aleatorios de mensajes", () => {
      randomMessages = testUtilities.createRandomMessages(10);
    });

    // Otra vez, estamos haciendo un componente de React testeable. Esta vez,
    // es nuestro componente `Inbox`.
    let inboxWrapper;
    beforeEach("Crea <Inbox />", () => {
      state.value = null;
      inboxWrapper = shallow(<Inbox />);
    });

    describe("contenido visual", () => {
      // ¿Cómo definís el estado inicial de un componente de React?

      it("empieza con un estado inicial de un arreglo vacío de mensajes", () => {
        /**
         * IMPORTANTE: para que los test funcionen necesitaras usar la sintaxis React.useState()
         *
         * Correcto -> React.useState()
         * Incorrecto -> useState()
         */

        // El estado inicial de los mensajes deberia hacer que no se muestre ninguno.
        expect(inboxWrapper.find(Message)).to.have.length(0);
        expect(state.value).to.be.deep.equal([]);
      });
      // No te preocupes sobre `markAsRead`, Esto no corresponde a este a estos tests
      it("esta compuesto de componentes <Message /> (NOTA: no es necesario un prop `markAsRead`)  basado en que es colocado en el estado", () => {
        // Esto va a alterar el *estado local* del componente que fue simulado mas arriba.
        state.value = randomMessages;
        inboxWrapper.setProps(); // Fuerza al componente a renderear nuevamente.

        // Debería haber ahora un montón de componentes `Message` en el output.
        expect(inboxWrapper.find(Message)).to.have.length(10);

        // El primer mensaje mostrado en el inbox debería estar basado en el
        // primer elemento del arreglo randomMessages.
        const firstMessage = inboxWrapper.find(Message).at(0);
        expect(firstMessage.equals(<Message fullMessage={randomMessages[0]} />))
          .to.be.true;

        // Nuevamente modificamos el estado local del componente.
        state.value = randomMessages.slice(4);
        inboxWrapper.setProps();

        expect(inboxWrapper.find(Message)).to.have.length(6);
      });

      it("cada componente <Message /> tiene una property `key`", () => {
        state.value = randomMessages;
        inboxWrapper.setProps();

        const messages = inboxWrapper.find(Message);
        // Cada componente `Message` deberia contar con una prop `key`.
        messages.forEach((msg) => {
          expect(msg.key()).to.exist;
        });
      });
    });
  });

  describe("NewMessageForm", () => {
    let sendSpy;
    let newMessageFormWrapper;

    beforeEach("Crea <NewMessageForm /> wrapper", () => {
      // Crea la función `spy`
      sendSpy = spy();
      // fijate: estamos haciendo un NewMessageForm con un prop `onSend`,
      // seteado a la función.
      newMessageFormWrapper = shallow(<NewMessageForm onSend={sendSpy} />);
    });

    // El siguiente spec va a causar que el formulario se "submitié". Cuando eso
    // pase, el componente debería 1) invocar el prop `onSend`, y 2) pasar
    // el estado actual del componente.

    it("Invoca la función `onSend` pasando un objeto con los estados iniciales cuando el formulario se submitea", () => {
      // El formulario deberia tener un evento `onSubmit` asociado a la prop `onSend`.
      expect(newMessageFormWrapper.find("form").prop("onSubmit")).to.be.a(
        "function"
      );

      // Esto va a disparar cualquier onSubmit handler registrado en el componente.
      newMessageFormWrapper.simulate("submit", { preventDefault: () => {} });

      expect(sendSpy).to.have.been.called;

      // Prueba que fue llamado con el estado inicial y solo una vez (no en cada cambio).
      // Asegurate que la estructura con la que envias la data sea correcta.
      expect(sendSpy).to.have.been.calledOnceWith({
        recipient: "",
        subject: "",
        body: "",
      });
    });

    it("Setea un nuevo estado local cuando el input `recipient` cambia", () => {
      // El test spec esta buscando un campo del form específico
      const recipientInput = newMessageFormWrapper.find("#recipient-field");

      // Ese campo debe recibir una prop de nombre `value` que sea un string.
      expect(recipientInput.prop("value")).to.be.a("string");
      expect(recipientInput.prop("value")).to.equal("");

      // Tambien debe recibir una prop de nombre `onChange` que sea una función.
      expect(recipientInput.prop("onChange")).to.be.a("function");

      // Ahora causamos un cambio en el input, simulando el evento.
      recipientInput.simulate("change", {
        target: { value: "facu@plataforma5.la", name: "recipient" },
      });

      // Ahora simulamos el submit del form.
      newMessageFormWrapper.simulate("submit", { preventDefault: () => {} });

      expect(sendSpy).to.have.been.called;

      // Prueba que fue llamado con la informacion recien pasada.
      expect(sendSpy).to.have.been.calledOnceWith({
        recipient: "facu@plataforma5.la",
        subject: "",
        body: "",
      });
    });

    it("Soporta cambios en multiples inputs", () => {
      const recipientInput = newMessageFormWrapper.find("#recipient-field");
      const subjectInput = newMessageFormWrapper.find("#subject-field");
      const bodyInput = newMessageFormWrapper.find("#body-field");

      const formInfo = {
        recipient: "santi@plataforma5.la",
        subject: "Más memes",
        body: "Necesitamos más memes de harry potter para el contenido del bootcamp",
      };

      recipientInput.simulate("change", {
        target: { value: formInfo.recipient, name: "recipient" },
      });
      subjectInput.simulate("change", {
        target: { value: formInfo.subject, name: "subject" },
      });
      bodyInput.simulate("change", {
        target: { value: formInfo.body, name: "body" },
      });

      // Esto va a disparar cualquier onSubmit handler registrado en el componente.
      newMessageFormWrapper.simulate("submit", { preventDefault: () => {} });

      expect(sendSpy).to.have.been.called;
      expect(sendSpy).to.have.been.calledOnceWith(formInfo);
    });
  });
});
