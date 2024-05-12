import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { ModalComponent } from '.';
import TokenDatabase from '../store/tokendb';
import {DataToken,IFormValues}  from '../store/datatype';
import { Button, TextField, Typography, Grid, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import YupValidationSchema from '../schemas/validation.schema';

interface OwnProps {}

const initialValues: IFormValues = {
  instrument: '',
  minNotional: 0,
  maxNotional: 0,
  expirationDate: new Date(),
  type: 'call',
  premium: 0,
  strikePrice: 0,
  quantity: 0,
  price: 0,
  tokenName: '',
};

const TradeFormComponent: React.FC<OwnProps> = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [suggestedTokens, setSuggestedTokens] = useState<DataToken[]>();
  const [popup, setPopup] = useState<string>();

  const tokenDB = new TokenDatabase();


  const onSubmit = (values: IFormValues) => {
    // Handle form submission logic here
    console.log(values);
    if (values.instrument === 'Option') {
      console.log('Option Trade');
    }
    if (values.instrument === 'Spot') {
      console.log('Spot Trade');
    }
    if (values.tokenName === '') {
      console.log('Token Name is missing');

      const heuristicTokens = tokenDB.getHeuristicTokens(values);
      console.log(`Possible tokens are :`);
      heuristicTokens.forEach(token => console.log(`${token.name} (${token.symbol}): $${token.price}`));
      setSuggestedTokens(heuristicTokens);
      setPopup("");
      setIsOpen(true);
    } else {
      console.log('Token Name is present');
      setPopup("Received Details Successfully : "+JSON.stringify(values, undefined, 4));
      setIsOpen(true);
    }
    
  };

  const formik = useFormik<IFormValues>({
    initialValues,
    onSubmit,
    validationSchema: YupValidationSchema,
  });

  return (
    <div>
      <ModalComponent
        isDialogOpened={isOpen}
        handleCloseDialog={() => setIsOpen(false)}
        tokens={suggestedTokens || []}
        message={popup}
      />
      <React.Fragment>
        <form autoComplete="off" onSubmit={formik.handleSubmit}>
          <Typography variant="h5" fontWeight={600} mb={2}>
            Instrument Form
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <Select
                  name="instrument"
                  value={formik.values.instrument}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.instrument && Boolean(formik.errors.instrument)}
                >
                  <MenuItem value="Option">Option</MenuItem>
                  <MenuItem value="Spot">Spot</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Min. Notional"
                variant="outlined"
                color="primary"
                type="number"
                name="minNotional"
                fullWidth
                value={formik.values.minNotional}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.minNotional && Boolean(formik.errors.minNotional)}
                helperText={formik.touched.minNotional && formik.errors.minNotional}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Max. Notional"
                variant="outlined"
                color="primary"
                type="number"
                name="maxNotional"
                fullWidth
                value={formik.values.maxNotional}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.maxNotional && Boolean(formik.errors.maxNotional)}
                helperText={formik.touched.maxNotional && formik.errors.maxNotional}
              />
            </Grid>
            {formik.values.instrument === 'Option' && (
              <>
                <Grid item xs={6}>
                  <TextField
                    label="Expiration Date"
                    variant="outlined"
                    color="primary"
                    type="date"
                    name="expirationDate"
                    fullWidth
                    value={formik.values.expirationDate}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.expirationDate && Boolean(formik.errors.expirationDate)}
                    helperText={formik.touched.expirationDate && formik.errors.expirationDate}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Select
                  name="type"
                  value={formik.values.type}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.type && Boolean(formik.errors.type)}
                >
                  <MenuItem value="call">Call</MenuItem>
                  <MenuItem value="put">Put</MenuItem>
                </Select>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Premium (Per share)"
                    variant="outlined"
                    color="primary"
                    type="number"
                    name="premium"
                    fullWidth
                    value={formik.values.premium}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.premium && Boolean(formik.errors.premium)}
                    helperText={formik.touched.premium && formik.errors.premium}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Strike Price"
                    variant="outlined"
                    color="primary"
                    type="number"
                    name="strikePrice"
                    fullWidth
                    value={formik.values.strikePrice}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.strikePrice && Boolean(formik.errors.strikePrice)}
                    helperText={formik.touched.strikePrice && formik.errors.strikePrice}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Quantity"
                    variant="outlined"
                    color="primary"
                    type="number"
                    name="quantity"
                    fullWidth
                    value={formik.values.quantity}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.quantity && Boolean(formik.errors.quantity)}
                    helperText={formik.touched.quantity && formik.errors.quantity}
                  />
                </Grid>
              </>
            )}
            {formik.values.instrument === 'Spot' && (
              <>
                <Grid item xs={6}>
                  <TextField
                    label="Price"
                    variant="outlined"
                    color="primary"
                    type="number"
                    name="price"
                    fullWidth
                    value={formik.values.price}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.price && Boolean(formik.errors.price)}
                    helperText={formik.touched.price && formik.errors.price}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Quantity"
                    variant="outlined"
                    color="primary"
                    type="number"
                    name="quantity"
                    fullWidth
                    value={formik.values.quantity}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.quantity && Boolean(formik.errors.quantity)}
                    helperText={formik.touched.quantity && formik.errors.quantity}
                  />
                </Grid>
              </>
            )}
            <Grid item xs={12}>
              <TextField
                label="Token Name"
                variant="outlined"
                color="primary"
                type="text"
                name="tokenName"
                fullWidth
                value={formik.values.tokenName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.tokenName && Boolean(formik.errors.tokenName)}
                helperText={formik.touched.tokenName && formik.errors.tokenName}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                fullWidth
                size="medium"
                disabled={!formik.isValid}
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
      </React.Fragment>
    </div>
  );
};

export default TradeFormComponent;