import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';

dayjs.locale('pt-br');

export const formatCurrency = (value: number): string =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);

export const formatDecimal = (value: number): string =>
  new Intl.NumberFormat('pt-BR', { style: 'decimal' }).format(value);

export const formatPercent = (value: number): string =>
  new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);

export const formatDate = (date: Date, format = 'DD/MM/YYYY'): string => dayjs(date).format(format);

export const formatCpfCnpj = (value: string): string => {
  const cpfLength = 11;

  if (value.length === cpfLength) {
    return value.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }

  return value.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
};
