import type {
  Node,
  TableNode_Row,
} from '@/types/proto/api/v1/markdown_service';
import Renderer from './Renderer';

interface Props {
  index: string;
  header: Node[];
  rows: TableNode_Row[];
}

const Table = ({ header, rows }: Props) => {
  return (
    <table className="w-auto max-w-full divide-y divide-gray-300 border border-gray-300 dark:divide-zinc-600 dark:border-zinc-600">
      <thead className="text-left font-medium text-gray-900 text-sm leading-5 dark:text-gray-400">
        <tr className="divide-x divide-gray-300 dark:divide-zinc-600">
          {header.map((h, i) => (
            <th key={i} className="px-2 py-1">
              <Renderer key={`${h.type}-${i}`} index={String(i)} node={h} />
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-300 text-left text-gray-900 text-sm leading-5 dark:divide-zinc-600 dark:text-gray-400">
        {rows.map((row, i) => (
          <tr key={i} className="divide-x divide-gray-300 dark:divide-zinc-600">
            {row.cells.map((r, j) => (
              <td key={j} className="px-2 py-1">
                <Renderer
                  key={`${r.type}-${i}-${j}`}
                  index={String(j)}
                  node={r}
                />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
