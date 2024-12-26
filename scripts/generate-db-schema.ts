import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

async function generateSchemaDoc() {
  const prisma = new PrismaClient();
  const dmmf = await prisma._getDmmf();
  
  let markdown = '# Database Schema\n\n';
  
  // Generate models documentation
  markdown += '## Models\n\n';
  dmmf.datamodel.models.forEach(model => {
    markdown += `### ${model.name}\n\n`;
    markdown += '| Field | Type | Attributes |\n';
    markdown += '|-------|------|------------|\n';
    
    model.fields.forEach(field => {
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
  dmmf.datamodel.models.forEach(model => {
    const relations = model.fields.filter(f => f.relationName);
    if (relations.length > 0) {
      markdown += `### ${model.name} Relationships\n\n`;
      relations.forEach(rel => {
        markdown += `- ${model.name}.${rel.name} -> ${rel.type}\n`;
      });
      markdown += '\n';
    }
  });
  
  // Write to file
  fs.writeFileSync(
    path.join(process.cwd(), 'docs', 'database-schema.md'),
    markdown
  );
  
  await prisma.$disconnect();
  console.log('Schema documentation generated successfully!');
}

generateSchemaDoc().catch(console.error);
