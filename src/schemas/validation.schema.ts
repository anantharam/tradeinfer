import * as Yup from "yup";

const YupValidationSchema = Yup.object().shape({
  instrument: Yup.string().required('Required'),
  quantity: Yup.number().min(1, 'Quantity must be greater than 0').required('Required'),
  minNotional: Yup.number().min(0, 'Min Notional must be greater than or equal to 0').required('Required').max(Yup.ref('maxNotional'), 'Min Notional must be less than Max Notional')
  .when('instrument', {
    is: 'Spot',
    then: (schema : Yup.NumberSchema) => Yup.number()
      .required('Min Notional is required').positive('Min Notional must be greater than 0')
      .test({
        name: 'minNotionalSpot',
        message: 'Min Notional for a spot must be less than the product of price and quantity',
        test: function(this: Yup.TestContext, value: number) {
          const price = this.resolve(Yup.ref('price')) as number;
          const quantity = this.resolve(Yup.ref('quantity')) as number;
          return value <= price * quantity;
        }
      }),
  })
  .when('instrument', {
    is: 'Option',
    then: (schema : Yup.NumberSchema) => Yup.number()
      .required('Min Notional is required').positive('Min Notional must be greater than 0')
      .test({
        name: 'minNotionalOption',
        message: 'Min Notional for an option must be less than the product of strikePrice and quantity',
        test: function(this: Yup.TestContext, value: number) {
          const price = this.resolve(Yup.ref('strikePrice')) as number;
          const quantity = this.resolve(Yup.ref('quantity')) as number;
          return value <= price * quantity;
        }
      }),
  }),
  maxNotional: Yup.number().min(Yup.ref('minNotional'), 'Max Notional must be greater than Min Notional').required('Required')
  .when('instrument', {
    is: 'Spot',
    then: (schema : Yup.NumberSchema) => Yup.number()
      .required('Max Notional is required').positive('Max Notional must be greater than 0')
      .test({
        name: 'maxNotionalSpot',
        message: 'Max Notional for a spot must be greater than the product of price and quantity',
        test: function(this: Yup.TestContext, value: number) {
          const price = this.resolve(Yup.ref('price')) as number;
          const quantity = this.resolve(Yup.ref('quantity')) as number;
          return value >= price * quantity;
        }
      }),
  })
  .when('instrument', {
    is: 'Option',
    then: (schema : Yup.NumberSchema) => Yup.number()
      .required('Max Notional is required').positive('Max Notional must be greater than 0')
      .test({
        name: 'maxNotionalOption',
        message: 'Max Notional for an option must be greater than the product of strikePrice and quantity',
        test: function(this: Yup.TestContext, value: number) {
          const price = this.resolve(Yup.ref('strikePrice')) as number;
          const quantity = this.resolve(Yup.ref('quantity')) as number;
          return value >= price * quantity;
        }
      }),
  }),
  expirationDate: Yup.date().when('instrument', {
    is: 'Option',
    then: (schema) => Yup.date().min(new Date(), 'Expiration Date must be later than the current date').required('Required'),
  }),
  type: Yup.string().when('instrument', {
    is: 'Option',
    then: (schema) => Yup.string().required('Required'),
  }),
  premium: Yup.number().when('instrument', {
    is: 'Option',
    then: (schema) =>  Yup.number().min(1, 'Premium must be greater than 0').required('Required'),
  }),
  strikePrice: Yup.number().when('instrument', {
    is: 'Option',
    then: (schema) =>  Yup.number().min(1, 'Strike Price must be greater than 0').required('Required'),
  }),
  price: Yup.number().when('instrument', {
    is: 'Spot',
    then: (schema) => Yup.number().min(1, 'Price must be greater than 0').required('Required'),
  }),
  tokenName: Yup.string().notRequired(),
});

export default YupValidationSchema;
