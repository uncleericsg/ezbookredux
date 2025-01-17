import { PrismaClient, Prisma } from '@prisma/client';
import fs from 'fs';
import path from 'path';

interface Field {
  name: string;
  type: string;
  isId?: boolean;
  isUnique?: boolean;
  isRequired?: boolean;
  hasDefaultValue?: boolean;
  default?: unknown;
  relationName?: string;
}

interface Model {
  name: string;
  fields: Field[];
}

async function generateSchemaDoc() {
  const prisma = new PrismaClient();
  
  // Get the Prisma schema metadata
  const models = Object.keys(Prisma.ModelName).map(modelName => {
    const dmmf = (Prisma.dmmf as any).datamodel.models.find(
      (m: any) => m.name === modelName
    );
    
    return {
      name: modelName,
      fields: dmmf.fields.map((field: any) => ({
        name: field.name,
        type: field.type,
        isId: field.isId,
        isUnique: field.isUnique,
        isRequired: field.isRequired,
        hasDefaultValue: field.hasDefaultValue,
        default: field.default,
        relationName: field.relationName
      }))
    };
  });
  
  let markdown = '# Database Schema\n\n';
  
  // Generate models documentation
  markdown += '## Models\n\n';
  models.forEach((model: Model) => {
    markdown += `### ${model.name}\n\n`;
    markdown += '| Field | Type | Attributes |\n';
    markdown += '|-------|------|------------|\n';
    
    model.fields.forEach((field: Field) => {
      const attributes = [];
      if (field.isId) attributes.push('Primary Key');
      if (field.isUnique) attributes.push('Unique');
      if (field.isRequired) attributes.push('Required');
      if (field.hasDefaultValue) attributes.push(`Default: ${field.default}`);
      if (field.relationName) attributes.push(`Relation: ${field.relationName}`);
      
      markdown += `| ${field.name} | ${field.type} | ${attributes.join(', ')} |\n`;
    });
    
    markdown += '\n';
  });
  
  // Generate relationships documentation
  markdown += '## Relationships\n\n';
  models.forEach((model: Model) => {
    const relations = model.fields.filter(f => f.relationName);
    if (relations.length > 0) {
      markdown += `### ${model.name} Relationships\n\n`;
      relations.forEach(rel => {
        markdown += `- ${model.name}.${rel.name} -> ${rel.type}\n`;
      });
      markdown += '\n';
    }
  });
  
  // Ensure docs directory exists
  const docsDir = path.join(process.cwd(), 'docs');
  if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir);
  }
  
  // Write to file
  fs.writeFileSync(
    path.join(docsDir, 'database-schema.md'),
    markdown
  );
  
  await prisma.$disconnect();
  console.log('Schema documentation generated successfully!');
}

generateSchemaDoc().catch(console.error);
