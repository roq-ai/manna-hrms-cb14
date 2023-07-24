import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  Flex,
} from '@chakra-ui/react';
import Breadcrumbs from 'components/breadcrumb';
import DatePicker from 'components/date-picker';
import { Error } from 'components/error';
import { FormWrapper } from 'components/form-wrapper';
import { NumberInput } from 'components/number-input';
import { SelectInput } from 'components/select-input';
import { AsyncSelect } from 'components/async-select';
import { TextInput } from 'components/text-input';
import AppLayout from 'layout/app-layout';
import { FormikHelpers, useFormik } from 'formik';
import { useRouter } from 'next/router';
import { FunctionComponent, useState } from 'react';
import * as yup from 'yup';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';

import { createEmployee } from 'apiSdk/employees';
import { employeeValidationSchema } from 'validationSchema/employees';
import { UserInterface } from 'interfaces/user';
import { getUsers } from 'apiSdk/users';
import { EmployeeInterface } from 'interfaces/employee';

function EmployeeCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: EmployeeInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createEmployee(values);
      resetForm();
      router.push('/employees');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<EmployeeInterface>({
    initialValues: {
      onboarding_status: false,
      probation_status: false,
      exit_status: false,
      user_id: (router.query.user_id as string) ?? null,
    },
    validationSchema: employeeValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout
      breadcrumbs={
        <Breadcrumbs
          items={[
            {
              label: 'Employees',
              link: '/employees',
            },
            {
              label: 'Create Employee',
              isCurrent: true,
            },
          ]}
        />
      }
    >
      <Box rounded="md">
        <Box mb={4}>
          <Text as="h1" fontSize={{ base: '1.5rem', md: '1.875rem' }} fontWeight="bold" color="base.content">
            Create Employee
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <FormWrapper onSubmit={formik.handleSubmit}>
          <FormControl
            id="onboarding_status"
            display="flex"
            alignItems="center"
            mb="4"
            isInvalid={!!formik.errors?.onboarding_status}
          >
            <FormLabel htmlFor="switch-onboarding_status">Onboarding Status</FormLabel>
            <Switch
              id="switch-onboarding_status"
              name="onboarding_status"
              onChange={formik.handleChange}
              value={formik.values?.onboarding_status ? 1 : 0}
            />
            {formik.errors?.onboarding_status && (
              <FormErrorMessage>{formik.errors?.onboarding_status}</FormErrorMessage>
            )}
          </FormControl>

          <FormControl
            id="probation_status"
            display="flex"
            alignItems="center"
            mb="4"
            isInvalid={!!formik.errors?.probation_status}
          >
            <FormLabel htmlFor="switch-probation_status">Probation Status</FormLabel>
            <Switch
              id="switch-probation_status"
              name="probation_status"
              onChange={formik.handleChange}
              value={formik.values?.probation_status ? 1 : 0}
            />
            {formik.errors?.probation_status && <FormErrorMessage>{formik.errors?.probation_status}</FormErrorMessage>}
          </FormControl>

          <FormControl
            id="exit_status"
            display="flex"
            alignItems="center"
            mb="4"
            isInvalid={!!formik.errors?.exit_status}
          >
            <FormLabel htmlFor="switch-exit_status">Exit Status</FormLabel>
            <Switch
              id="switch-exit_status"
              name="exit_status"
              onChange={formik.handleChange}
              value={formik.values?.exit_status ? 1 : 0}
            />
            {formik.errors?.exit_status && <FormErrorMessage>{formik.errors?.exit_status}</FormErrorMessage>}
          </FormControl>
          <AsyncSelect<UserInterface>
            formik={formik}
            name={'user_id'}
            label={'Select User'}
            placeholder={'Select User'}
            fetcher={getUsers}
            labelField={'email'}
          />
          <Flex justifyContent={'flex-start'}>
            <Button
              isDisabled={formik?.isSubmitting}
              bg="state.info.main"
              color="base.100"
              type="submit"
              display="flex"
              height="2.5rem"
              padding="0rem 1rem"
              justifyContent="center"
              alignItems="center"
              gap="0.5rem"
              mr="4"
              _hover={{
                bg: 'state.info.main',
                color: 'base.100',
              }}
            >
              Submit
            </Button>
            <Button
              bg="neutral.transparent"
              color="neutral.main"
              type="button"
              display="flex"
              height="2.5rem"
              padding="0rem 1rem"
              justifyContent="center"
              alignItems="center"
              gap="0.5rem"
              mr="4"
              onClick={() => router.push('/employees')}
              _hover={{
                bg: 'neutral.transparent',
                color: 'neutral.main',
              }}
            >
              Cancel
            </Button>
          </Flex>
        </FormWrapper>
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'employee',
    operation: AccessOperationEnum.CREATE,
  }),
)(EmployeeCreatePage);
