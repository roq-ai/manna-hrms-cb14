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
  Center,
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
import useSWR from 'swr';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { getEmployeeById, updateEmployeeById } from 'apiSdk/employees';
import { employeeValidationSchema } from 'validationSchema/employees';
import { EmployeeInterface } from 'interfaces/employee';
import { UserInterface } from 'interfaces/user';
import { getUsers } from 'apiSdk/users';

function EmployeeEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<EmployeeInterface>(
    () => (id ? `/employees/${id}` : null),
    () => getEmployeeById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: EmployeeInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateEmployeeById(id, values);
      mutate(updated);
      resetForm();
      router.push('/employees');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<EmployeeInterface>({
    initialValues: data,
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
              label: 'Update Employee',
              isCurrent: true,
            },
          ]}
        />
      }
    >
      <Box rounded="md">
        <Box mb={4}>
          <Text as="h1" fontSize={{ base: '1.5rem', md: '1.875rem' }} fontWeight="bold" color="base.content">
            Update Employee
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
    operation: AccessOperationEnum.UPDATE,
  }),
)(EmployeeEditPage);
