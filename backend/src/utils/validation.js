
/**
 * Validações de dados usando Joi
 * Schemas para validar entrada de dados
 */

const Joi = require('joi');

// Schema para cadastro de fornecedor
const fornecedorSchema = Joi.object({
  cnpj: Joi.string().pattern(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/).required()
    .messages({ 'string.pattern.base': 'CNPJ deve estar no formato XX.XXX.XXX/XXXX-XX' }),
  razaoSocial: Joi.string().min(3).max(100).required(),
  cep: Joi.string().pattern(/^\d{5}-?\d{3}$/).required()
    .messages({ 'string.pattern.base': 'CEP deve estar no formato XXXXX-XXX' }),
  endereco: Joi.string().min(5).max(200).required(),
  numero: Joi.string().max(10).required(),
  email: Joi.string().email().required(),
  senha: Joi.string().min(6).required()
});

// Schema para cadastro de beneficiário
const beneficiarioSchema = Joi.object({
  nis: Joi.string().length(11).pattern(/^\d{11}$/).required()
    .messages({ 'string.pattern.base': 'NIS deve conter exatamente 11 dígitos' }),
  email: Joi.string().email().required()
});

// Schema para login
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

// Schema para lançamento
const lancamentoSchema = Joi.object({
  ano: Joi.number().integer().min(2020).max(2030).required(),
  mes: Joi.string().valid(
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ).required(),
  toneladasProcessadas: Joi.number().positive().required(),
  energiaGerada: Joi.number().positive().required(),
  impostoAbatido: Joi.number().positive().required()
});

module.exports = {
  fornecedorSchema,
  beneficiarioSchema,
  loginSchema,
  lancamentoSchema
};
